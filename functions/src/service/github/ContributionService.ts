import {Service} from "typedi";
import {GithubService} from "../GithubService";
import {ProfileService} from "../ProfileService";
import {GlobalDate} from "../../global/globalDate";

@Service()
export class ContributionService {
    constructor(private githubService: GithubService, private profileService: ProfileService) {
    }

    async synchronizeGithubUserContributions() {
        const KR_HOURS = 9;
        const KR_TIME_DIFF = KR_HOURS * 60 * 60 * 1000;

        const profiles = await this.profileService.readAllProfiles();
        const date = new GlobalDate();

        const startDateInKST = date.trackingBeginDate;
        startDateInKST.setHours(KR_HOURS, 0, 0, 0);

        const lastDateInKST = new Date(startDateInKST);
        lastDateInKST.setDate(startDateInKST.getDate() + 27);

        const d = new Date();
        const utc = d.getTime() + (d.getTimezoneOffset() * 60 * 1000);
        const currentDateInKST = new Date(utc + KR_TIME_DIFF);

        await Promise.all(profiles.map(async (profile) => {
            const githubUsername = profile.githubUsername;

            const response = await this.githubService.getGithubUserContributions(
                githubUsername,
                date.eventStartDate,
                lastDateInKST
            );

            const resultArray: number[] = [];

            response.data.user.contributionsCollection.contributionCalendar.weeks.forEach(
                (week: any) => {
                    week.contributionDays.forEach((day: any) => {
                        // 각 날짜에 대한 contributionCount와 date를 객체로 만들어 배열에 추가
                        const contributionDateInKST = new Date(day.date);
                        contributionDateInKST.setHours(KR_HOURS, 0, 0, 0);
                        if (contributionDateInKST >= startDateInKST) {
                            resultArray.push(
                                (contributionDateInKST <= currentDateInKST) ? day.contributionCount : -1
                            );
                        }
                    });
                }
            );

            const totalContributions: number = response.data.user.contributionsCollection
                .contributionCalendar.totalContributions;

            await this.profileService.updateContributeCounts(githubUsername, resultArray);
            await this.profileService.updateTotalContributions(githubUsername, totalContributions);
        }));
    }
}
