import axios, {AxiosInstance} from "axios";
import {defineSecret} from "firebase-functions/params";

const githubAccessToken = defineSecret("GITHUB_TOKEN");

export class GithubApiClient {
    private client: AxiosInstance;


    constructor() {
        console.log("githubaccesstoken", githubAccessToken.value());
        this.client = axios.create({
            baseURL: "https://api.github.com/",
            headers: {"Authorization": `Bearer ${githubAccessToken.value()}`},
        });
    }

    async getUserEvents(username: string): Promise<any> {
        try {
            const response = await this.client.get(`/users/${username}/events`);
            return response.data;
        } catch (error) {
            console.error("Error fetching GitHub user events:", error);
            throw error;
        }
    }

    async getUserContributionData(userName: string, from: Date, to: Date): Promise<any> {
        const query = `
      query ($userName: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $userName) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;
        const variables = {
            userName,
            from,
            to,
        };

        try {
            const response = await this.client.post("/graphql", {
                query,
                variables,
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching GitHub user contribution data:", error);
            throw error;
        }
    }
}
