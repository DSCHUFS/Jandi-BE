import {Service} from "typedi";
import {CrawlingStatusRepository} from "../repository/CrawlingStatusRepository";
import {CrawlingStatus} from "../model/CrawlingStatus";

@Service()
export class CrawlingStatusService {
    constructor(private crawlingStatusRepository: CrawlingStatusRepository) {
    }

    async readCrawlingStatus(): Promise<CrawlingStatus | undefined> {
        return await this.crawlingStatusRepository.getStatus();
    }

    async updateCrawlingStatus() {
        return await this.crawlingStatusRepository.createStatus({
            lastUpdatedAt: new Date(),
        });
    }
}
