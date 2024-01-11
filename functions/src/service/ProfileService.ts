import {Service} from "typedi";
import {ProfileRepository} from "../repository/ProfileRepository";
import {Profile} from "../model/Profile";

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
        let currentStreak = 0;
        let maxStreak = 0;

        for (let index = last28daysContributionCounts.length - 1; index >= 0; index--) {
            if (last28daysContributionCounts[index] > 0) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 0; // Streak가 끊기면 현재 streak를 0으로 리셋
            }
        }

        return maxStreak;
    }
}
