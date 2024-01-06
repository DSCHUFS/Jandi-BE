import {ProfileService} from "./ProfileService";
import {GithubService} from "./GithubService";
import {Service} from "typedi";
import {PushEventRepository} from "../repository/PushEventRepository";

@Service()
export class ScheduledSynchronizeService {
    constructor(private profileService: ProfileService,
                private githubService: GithubService,
                private pushEventService: PushEventRepository) {
    }

    async synchronizePushEvents() {
        const profiles = await this.profileService.readAllProfiles();
        for (const profile of profiles) {
            const githubUserPushEvents = await this.githubService.getGithubUserPushEvents(profile.githubUsername);

            let latestDate = new Date(0);
            for (const event of githubUserPushEvents) {
                await this.pushEventService.createPushEvent(profile.githubUsername, event);
                const eventDate = new Date(event.createdAt);
                if (eventDate > latestDate) {
                    latestDate = eventDate;
                }
            }
            if (latestDate > new Date(0)) {
                await this.profileService.updateLatestPushedAt(profile.githubUsername, latestDate);
            }
        }
    }
}
