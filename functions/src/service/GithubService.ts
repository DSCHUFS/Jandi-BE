import {Service} from "typedi";
import {GithubApiClient} from "../apiclient/GithubApiClient";
import {ProfilePushEvent} from "../model/ProfilePushEvent";

@Service()
export class GithubService {
    private client: GithubApiClient;

    constructor() {
        this.client = new GithubApiClient();
    }

    async getGithubUserPushEvents(username: string): Promise<ProfilePushEvent[]> {
        return (await this.client.getUserEvents(username)).filter((event: any) => event.type === "PushEvent")
            .map((event: any) => {
                return {
                    id: event["id"],
                    repositoryName: event["repo"]["name"],
                    repositoryUrl: event["repo"]["url"],
                    createdAt: event["created_at"],
                };
            });
    }

    async getGithubUserContributions(username: string, from: string, to: string) {
        return this.client.getUserContributionData(username, from, to);
    }
}
