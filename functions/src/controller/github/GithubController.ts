import {Controller, Get, Param} from "routing-controllers";
import {Service} from "typedi";
import {GithubService} from "../../service/GithubService";
import {ProfileService} from "../../service/ProfileService";

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
        const startDate = new Date(2023, 11, 20);
        const lastDate = new Date(startDate);
        lastDate.setDate(startDate.getDate() + 27);
        const currentDate = new Date();

        console.log(startDate, lastDate);
        const response = await this.githubService.getGithubUserContributions(
            githubUsername,
            startDate,
            lastDate
        );
        console.log(response, currentDate);

        const resultArray: number[] = [];

        response.data.user.contributionsCollection.contributionCalendar.weeks.forEach(
            (week: any) => {
                week.contributionDays.forEach((day: any) => {
                    // 각 날짜에 대한 contributionCount와 date를 객체로 만들어 배열에 추가
                    resultArray.push(
                        day.contributionCount
                    );
                });
            }
        );

        console.log(resultArray);

        const totalContributions: number = response.data.user
            .contributionsCollection.contributionCalendar.totalContributions;

        await this.profileService.updateContributeCounts(githubUsername, resultArray);
        await this.profileService.updateTotalContributions(githubUsername, totalContributions);


        return response;
    }
}
