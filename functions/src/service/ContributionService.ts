import { Service } from "typedi";
import { GithubService } from "./GithubService";
import { ProfileService } from "./ProfileService";
import { GlobalDate } from "../global/globalDate";

@Service()
export class ContributionService {
    constructor(private githubService: GithubService, private profileService: ProfileService){}

    async syncronizeGithubUserContributions() {
        const profiles = await this.profileService.readAllProfiles();
        const date = new GlobalDate();

        const totalContributesDate = date.eventStartDate;
        const startDate = date.trackingBeginDate;
        const lastDate = new Date(startDate);
        lastDate.setDate(startDate.getDate() + 27);

        const d = new Date();
        const utc = d.getTime() + (d.getTimezoneOffset() * 60 * 1000);
        const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
        const currentDate = new Date(utc+KR_TIME_DIFF);
        
        await Promise.all(profiles.map(async (profile) => {
            const githubUsername = profile.githubUsername;

            const response = await this.githubService.getGithubUserContributions(
                githubUsername,
                totalContributesDate,
                lastDate
            );

            const resultArray: number[] = [];

            response.data.user.contributionsCollection.contributionCalendar.weeks.forEach(
                (week: any) => {
                    week.contributionDays.forEach((day: any) => {
                        // 각 날짜에 대한 contributionCount와 date를 객체로 만들어 배열에 추가
                        if (new Date(day.date) >= startDate) {
                            resultArray.push(
                                (new Date(day.date) <= currentDate) ? day.contributionCount : -1
                            );
                        }
                    });
                }
            );

            const totalContributions: number = response.data.user.contributionsCollection.contributionCalendar.totalContributions;

            await this.profileService.updateContributeCounts(githubUsername, resultArray);
            await this.profileService.updateTotalContributions(githubUsername, totalContributions);
        }));
    }
}