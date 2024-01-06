export interface Profile {
    name: string,
    githubUsername: string,
    websiteUrl: string,
    totalCommitCounts: number,
    last28daysPushCounts: number[],
    latestPushedAt: string,
    createdAt: string,
    modifiedAt: string
}