import {Service} from "typedi";
import {ProfileService} from "../ProfileService";
import {PushEventService} from "../PushEventService";
import {GithubService} from "../GithubService";

@Service()
export class GithubEventService {
    constructor(private profileService: ProfileService,
                private pushEventService: PushEventService,
                private githubService: GithubService) {
    }

    async synchronizePushEvents() {
        const profiles = await this.profileService.readAllProfiles();

        // 모든 프로필에 대해 병렬로 작업 수행
        await Promise.all(profiles.map(async (profile) => {
            const githubUserPushEvents = await this.githubService.getGithubUserPushEvents(profile.githubUsername);

            let latestDate = new Date(0);
            await Promise.all(githubUserPushEvents.map(async (event) => {
                const isExist = await this.pushEventService.isPushEventExist(profile.githubUsername, event.id);
                if (!isExist) {
                    await this.pushEventService.createPushEvent(profile.githubUsername, event);
                }
                const eventDate = new Date(event.createdAt);
                if (eventDate > latestDate) {
                    latestDate = eventDate;
                }
            }));

            if (latestDate > new Date(0)) {
                await this.profileService.updateLatestPushedAt(profile.githubUsername, latestDate);
            }
        }));
    }
}
