import {Controller, Get, HttpError, Param, QueryParam} from "routing-controllers";
import {Service} from "typedi";
import {prepareResponse} from "../../lib/ApiResponse";
import {ProfileService} from "../../service/ProfileService";
import {PushEventService} from "../../service/PushEventService";
import {ProfileGetResponse} from "./request/ProfileGetResponse";
import {Profile} from "../../model/Profile";

@Controller("/profiles")
@Service()
export class ProfileController {
    constructor(private profileService: ProfileService, private pushEventService: PushEventService) {
    }

    @Get("/")
    async getAll(@QueryParam("sort") sortBy: string) {
        const profiles: ProfileGetResponse[] = (await this.profileService.readAllProfiles()).map((profile: Profile) => {
            const streak = this.profileService.calculateStreakCounts(profile.last28daysContributionCounts);
            return {
                name: profile.name,
                githubUsername: profile.githubUsername,
                websiteUrl: profile.websiteUrl,
                totalContributions: profile.totalContributions,
                last28daysContributionCounts: profile.last28daysContributionCounts,
                latestPushedAt: profile.latestPushedAt,
                createdAt: profile.createdAt,
                modifiedAt: profile.modifiedAt,
                streakCounts: streak,
                activeDayCount: profile.last28daysContributionCounts.filter((count) => count > 0).length,
            };
        });

        profiles.sort((a, b) => {
            switch (sortBy) {
            case "latestPushedAt":
                if (!a.latestPushedAt) return 1;
                if (!b.latestPushedAt) return -1;
                return new Date(b.latestPushedAt).getTime() - new Date(a.latestPushedAt).getTime();
            case "streakCounts":
                if (a.streakCounts === undefined) return 1;
                if (b.streakCounts === undefined) return -1;
                return b.streakCounts - a.streakCounts;
            case "totalContributions":
                if (a.totalContributions === undefined) return 1;
                if (b.totalContributions === undefined) return -1;
                return b.totalContributions - a.totalContributions;
            case "activeDayCount":
                if (a.activeDayCount === undefined) return 1;
                if (b.activeDayCount === undefined) return -1;
                return b.activeDayCount - a.activeDayCount;
            default:
                return 0;
            }
        });

        return prepareResponse(profiles, "");
    }


    @Get("/:githubUsername")
    async getOne(@Param("githubUsername") githubUsername: string) {
        const profile = await this.profileService.readProfile(githubUsername);

        if (profile) {
            const streak = this.profileService.calculateStreakCounts(profile.last28daysContributionCounts);
            const response: ProfileGetResponse = {
                name: profile.name,
                githubUsername: profile.githubUsername,
                websiteUrl: profile.websiteUrl,
                totalContributions: profile.totalContributions,
                last28daysContributionCounts: profile.last28daysContributionCounts,
                latestPushedAt: profile.latestPushedAt,
                createdAt: profile.createdAt,
                modifiedAt: profile.modifiedAt,
                streakCounts: streak,
                activeDayCount: profile.last28daysContributionCounts.filter((count) => count > 0).length,
            };
            return prepareResponse(response, "");
        } else {
            throw new HttpError(404, "Profile not found");
        }
    }

    @Get("/:githubUsername/pushEvents/today")
    async getProfileTodayPushEvents(@Param("githubUsername") githubUsername: string) {
        const pushEvents = await this.pushEventService.readTodayPushEvents(githubUsername);
        return prepareResponse(pushEvents, "");
    }

    // TODO : Disable this API in production
    // @Post("/")
    // async postOne(@Body({required: true}) profileCreateRequest: ProfileCreateRequest) {
    //     await this.profileService.createProfile({
    //         githubUsername: profileCreateRequest.githubUsername,
    //         name: profileCreateRequest.name,
    //         websiteUrl: profileCreateRequest.websiteUrl,
    //         totalContributions: 0,
    //         last28daysContributionCounts: [],
    //         latestPushedAt: "",
    //         createdAt: new Date(),
    //         modifiedAt: new Date(),
    //     });
    //
    //     const profile = await this.profileService.readProfile(profileCreateRequest.githubUsername);
    //     if (profile) {
    //         return prepareResponse(profile, "");
    //     } else {
    //         throw new HttpError(500, "Profile create failed");
    //     }
    // }
}
