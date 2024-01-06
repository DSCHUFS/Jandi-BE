import {Service} from "typedi";
import {GithubApiClient} from "../apiclient/GithubApiClient";

@Service()
export class GithubService {
    private client: GithubApiClient;

    constructor() {
        this.client = new GithubApiClient();
    }

    async getGithubUserPushEvents(username: string) {
        return this.client.getUserEvents(username);
    }

    async getGithubUserContributions(username: string, from: Date, to: Date) {
        return this.client.getUserContributionData(username, from, to);
    }
}
