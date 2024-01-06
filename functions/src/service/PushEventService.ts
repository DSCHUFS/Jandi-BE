import {Service} from "typedi";
import {PushEventRepository} from "../repository/PushEventRepository";
import {ProfilePushEvent} from "../model/ProfilePushEvent";

@Service()
export class PushEventService {
    constructor(private pushEventRepository: PushEventRepository) {
    }

    async createPushEvent(githubUsername: string, pushEvent: ProfilePushEvent) {
        return await this.pushEventRepository.createPushEvent(githubUsername, pushEvent);
    }

    async readTodayPushEvents(githubUsername: string): Promise<ProfilePushEvent[]> {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0); // 오늘 날짜의 시작 (자정)

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999); // 오늘 날짜의 끝 (23시 59분 59초)

        return await this.pushEventRepository.readPushEventsByCreatedAt(githubUsername, todayStart, todayEnd);
    }
}
