import {Controller, Get, Param} from "routing-controllers";
import {Service} from "typedi";
import {GithubService} from "../../service/GithubService";

@Controller("/github")
@Service()
export class GithubController {
    constructor(private githubService: GithubService) {
    }

    @Get("/getGithubUserPushEvents/:githubUsername")
    async getGithubUserPushEvents(@Param("githubUsername") githubUsername: string) {
        return this.githubService.getGithubUserPushEvents(githubUsername);
    }

    @Get("/getGithubUserContributions/:githubUsername")
    async getGithubUserContributions(@Param("githubUsername") githubUsername: string) {
        return this.githubService.getGithubUserContributions(githubUsername, "2024-01-01T00:00:00Z",
            "2024-12-31T00:00:00Z");
    }
}
