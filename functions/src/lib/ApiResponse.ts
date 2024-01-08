import {Container} from "typedi";
import {CrawlingStatusService} from "../service/CrawlingStatusService";

interface ApiResponse<T> {
    successful: boolean;
    data: T;
    message: string;
    timestamp: Date;
    lastUpdatedAt?: Date; // 선택적 속성
}


export default ApiResponse;

export async function prepareResponse<T>(data: T, message: string): Promise<ApiResponse<T>> {
    const crawlingStatusService = Container.get(CrawlingStatusService);
    const lastUpdatedAt = await crawlingStatusService.readCrawlingStatus();

    return {
        successful: true,
        data: data,
        message: message,
        timestamp: new Date(),
        lastUpdatedAt: lastUpdatedAt?.lastUpdatedAt,
    };
}
