export interface Profile {
    name: string,
    githubUsername: string,
    websiteUrl: string,
    totalCommitCounts: number,
    last28daysContributionCounts: number[],
    latestPushedAt: string,
    createdAt: string,
    modifiedAt: string
}
