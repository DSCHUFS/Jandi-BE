import {Service} from "typedi";
import {GithubService} from "../GithubService";
import {ProfileService} from "../ProfileService";
import {addDays, getCurrentKSTDate, GlobalDate, toKSTDate} from "../../global/globalDate";

@Service()
export class ContributionService {
    constructor(private githubService: GithubService, private profileService: ProfileService) {
    }

    async synchronizeGithubUserContributions() {
        const profiles = await this.profileService.readAllProfiles();
        const date = new GlobalDate();

        await Promise.all(profiles.map(async (profile) => {
            const githubUsername = profile.githubUsername;

            const response = await this.githubService.getGithubUserContributions(
                githubUsername,
                toKSTDate(date.DATE_EVENT_START),
                addDays(toKSTDate(date.DATE_EVENT_START), 27)
            );

            const resultArray: number[] = [];

            const nowInKST: Date = getCurrentKSTDate();

            response.data.user.contributionsCollection.contributionCalendar.weeks.forEach((week: any) => {
                week.contributionDays.forEach((day: any) => {
                    // day.date는 "YYYY-MM-DD" 형태의 문자열
                    const [contributionYear, contributionMonth, contributionDay] = day.date.split("-").map(Number);
                    const [startYear, startMonth, startDay] = date.DATE_EVENT_START.split("-").map(Number);

                    const currentYear = nowInKST.getFullYear();
                    const currentMonth = nowInKST.getMonth() + 1;
                    const currentDay = nowInKST.getDate();

                    const contributionDateNum = contributionYear * 10000 + contributionMonth * 100 + contributionDay;
                    const startDateNum = startYear * 10000 + startMonth * 100 + startDay;
                    const currentDateNum = currentYear * 10000 + currentMonth * 100 + currentDay;

                    if (contributionDateNum >= startDateNum) {
                        resultArray.push(
                            (contributionDateNum <= currentDateNum) ? day.contributionCount : -1
                        );
                    }
                });
            });

            const totalContributions: number = response.data.user.contributionsCollection
                .contributionCalendar.totalContributions;

            await this.profileService.updateContributeCounts(githubUsername, resultArray);
            await this.profileService.updateTotalContributions(githubUsername, totalContributions);
        }));
    }
}
