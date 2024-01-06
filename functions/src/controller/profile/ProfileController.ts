import {Body, Controller, Get, HttpError, Param, Post} from "routing-controllers";
import {Service} from "typedi";
import {prepareResponse} from "../../lib/ApiResponse";
import {ProfileCreateRequest} from "./request/ProfileCreateRequest";
import {ProfileService} from "../../service/ProfileService";

@Controller("/profiles")
@Service()
export class ProfileController {
    constructor(private profileService: ProfileService) {
    }

    @Get("/")
    async getAll() {
        const profiles = await this.profileService.readAllProfiles();
        return prepareResponse(profiles, "");
    }

    // @Get("/:githubUsername")
    // async getOne(@Param("githubUsername") githubUsername: string) {
    //     const profile = await this.profileService.readProfile(githubUsername);
    //     if (profile) {
    //         return prepareResponse(profile, "");
    //     } else {
    //         throw new HttpError(404, "Profile not found");
    //     }
    // }

    @Get("/:githubUsername")
    async getOneStreak(@Param("githubUsername") githubUsername: string) {
        const profile = await this.profileService.readProfile(githubUsername);

        if (profile) {
            const streak = await this.profileService.calculateStreakCounts(githubUsername);
            const streakProfile:any = {...profile, streakCounts: streak}
            return prepareResponse(streakProfile, "");
        } else {
            throw new HttpError(404, "Profile not found");
        }
    }

    @Post("/")
    async postOne(@Body({required: true}) profileCreateRequest: ProfileCreateRequest) {
        await this.profileService.createProfile({
            githubUsername: profileCreateRequest.githubUsername,
            name: profileCreateRequest.name,
            websiteUrl: profileCreateRequest.websiteUrl,
            totalCommitCounts: 0,
            last28daysContributionCounts: [],
            latestPushedAt: "",
            createdAt: new Date(),
            modifiedAt: new Date(),
        });

        const profile = await this.profileService.readProfile(profileCreateRequest.githubUsername);
        if (profile) {
            return prepareResponse(profile, "");
        } else {
            throw new HttpError(500, "Profile create failed");
        }
    }
}
