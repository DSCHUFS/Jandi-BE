import {Service} from "typedi";
import {CrawlingStatusService} from "./CrawlingStatusService";
import {ContributionService} from "./github/ContributionService";
import {GithubEventService} from "./github/GithubEventService";

@Service()
export class ScheduledSynchronizeService {
    constructor(private githubEventService : GithubEventService,
                private crawlingStatusService: CrawlingStatusService,
                private contributionService: ContributionService) {
    }

    async synchronize() {
        await Promise.all([
            this.githubEventService.synchronizePushEvents(),
            this.contributionService.synchronizeGithubUserContributions(),
        ]);

        await this.crawlingStatusService.updateCrawlingStatus();
    }
}
