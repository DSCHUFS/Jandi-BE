# Jandi - BE

Jandi is a project developed by GDSC HUFS, designed to motivate participants to maintain their Github Contributions for a continuous 28-day period. This backend system tracks and visualizes GitHub user activities. It periodically retrieves user Contributions and Push event data from GitHub, storing this information in Firebase's Firestore database to support frontend operations.

- **Technology Stack**: Typescript, Firebase Functions, Express.js
- **Scheduled Tasks**: Utilizes Firebase Functions' Schedule Function to parse Github data every 5 minutes (configurable in index.ts). For each user, the system makes 2 API calls every 5 minutes, resulting in approximately 24 requests per hour per user.
- **Database**: Firestore

### Setup and Execution

1. **Initial Configuration**
    - Clone the project and execute `npm install` to install required packages.
2. **Local Execution**
    - Launch a local server for debugging purposes using the `npm run serve` command.
3. **Deployment**
    - Log into Firebase using `firebase login`.
    - Deploy the project to Firebase with the `npm run deploy` command.

For more detailed guidance on using Firebase Functions, refer to the [Firebase Official Documentation](https://firebase.google.com/docs/functions/get-started?gen=2nd).

### Github API Usage (and User Capacity)

The GitHub API allows up to 5,000 requests per hour. This project uses a public account's access token to gather data within these limits. The access token is managed using Google Secret Manager.

For further details, please consult: https://cloud.google.com/security/products/secret-manager.

With the current setup of making 2 API calls every 5 minutes for each user, the system makes around 24 requests per hour per user. Therefore, the maximum number of users that can be supported under this limit is approximately 5000 / 24. To accommodate more users, the refresh interval of 5 minutes can be extended.

- **Contribution Calendar**: The GitHub GraphQL API is employed to obtain GitHub user's Contribution Calendar data.
- **Events**: User event data from GitHub is gathered using the standard GitHub REST API, focusing solely on PushEvents.

### Database Schema

The database is structured as follows, and it's designed to automatically update certain GitHub-related information in the profiles during each scheduled run. For the initial profile creation, users need to manually enter their `name` and `websiteUrl`, as these fields are not auto-updated. The `githubUsername` is the key field for automatic updates.

```
/profiles/{profileId}
   ├── name: string
   ├── githubUsername: string
   ├── websiteUrl: string
   ├── totalContributions: number
   ├── last28daysContributionCounts: number[]
   ├── latestPushedAt: string
   ├── createdAt: Date
   └── modifiedAt: Date

/profiles/{profileId}/pushEvents/{eventId}
   ├── id: string
   ├── repositoryName: string
   ├── repositoryUrl: string
   └── createdAt: Date

/crawlingStatus/{service - also "main"}
   └── lastUpdatedAt: Date
```