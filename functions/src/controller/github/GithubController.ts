import {Controller, Get, Param} from "routing-controllers";
import {Service} from "typedi";
import {GithubService} from "../../service/GithubService";
import {ProfileService} from "../../service/ProfileService";
import {GlobalDate} from "../../global/globalDate";

@Controller("/github")
@Service()
export class GithubController {
    constructor(private githubService: GithubService, private profileService: ProfileService) {
    }

    // constructor(private githubService: GithubService) {}

    @Get("/getGithubUserPushEvents/:githubUsername")
    async getGithubUserPushEvents(
        @Param("githubUsername") githubUsername: string
    ) {
        return this.githubService.getGithubUserPushEvents(githubUsername);
    }

    @Get("/getGithubUserContributions/:githubUsername")
    async getGithubUserContributions(
        @Param("githubUsername") githubUsername: string
    ) {
        const date = new GlobalDate();

        const totalContributesDate = date.eventStartDate;
        const startDate = date.trackingBeginDate;
        const lastDate = new Date(startDate);
        lastDate.setDate(startDate.getDate() + 27);

        const d = new Date();
        const utc = d.getTime() + (d.getTimezoneOffset() * 60 * 1000);
        const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
        const currentDate = new Date(utc + KR_TIME_DIFF);

        const response = await this.githubService.getGithubUserContributions(
            githubUsername,
            totalContributesDate,
            lastDate
        );

        console.log(date.eventStartDate, date.trackingBeginDate);
        console.log(startDate, lastDate);
        console.log(currentDate);

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

        const totalContributions: number = response.data.user
            .contributionsCollection.contributionCalendar.totalContributions;

        console.log(resultArray, totalContributions);

        await this.profileService.updateContributeCounts(githubUsername, resultArray);
        await this.profileService.updateTotalContributions(githubUsername, totalContributions);

        return response;
    }
}
