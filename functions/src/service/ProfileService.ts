import {Service} from "typedi";
import {ProfileRepository} from "../repository/ProfileRepository";
import {Profile} from "../model/Profile";
import {GlobalDate} from "../global/globalDate";

// import {ProfileResponse} from "../controller/profile/response";

@Service()
export class ProfileService {
    constructor(private profileRepository: ProfileRepository) {
    }

    async readProfile(githubUsername: string): Promise<Profile | undefined> {
        return await this.profileRepository.getProfile(githubUsername);
    }

    async createProfile(profile: Profile) {
        return await this.profileRepository.createProfile(profile);
    }

    async readAllProfiles(): Promise<Profile[]> {
        return await this.profileRepository.getAllProfiles();
    }

    async updateLatestPushedAt(githubUsername: string, latestPushedAt: Date) {
        await this.profileRepository.updateLatestPushedAt(githubUsername, latestPushedAt);
    }

    async updateContributeCounts(githubUsername: string, contributionCounts: number[]) {
        return await this.profileRepository.updateContributionCounts(githubUsername, contributionCounts);
    }

    async updateTotalContributions(githubUsername: string, totalContributions: number) {
        return await this.profileRepository.updateTotalContributions(githubUsername, totalContributions);
    }

    calculateStreakCounts(last28daysContributionCounts: number[]): number {
        const globalDate = new GlobalDate();

        const startDate: Date = globalDate.startDate;
        const currentDate: Date = new Date();

        const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
        // 현재 인덱스 : diffDays - 1
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // const test =[
        //     0, 0, 0, 0, 2, 1, 5, 1,
        //     4, 5, 3, 0, 0, 0, 1, 1,
        //     1, 1, 0, 0, 0, 0, 0, 0,
        //     0, 0, 0, 0
        // ];

        let count = 0;
        for (let index = diffDays - 1; index > 0; index--) {
            if (last28daysContributionCounts[index] > 0) {
                count++;
            } else {
                break;
            }
        }
        return count;
    }
}
