export interface ProfileGetResponse {
    name: string,
    githubUsername: string,
    websiteUrl: string,
    totalCommitCounts: number,
    last28daysContributionCounts: number[],
    latestPushedAt: string,
    createdAt: Date,
    modifiedAt: Date,
    streakCounts: number
}
