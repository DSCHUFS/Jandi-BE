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
        const nowUTC = new Date();

        // Convert UTC time to KST time (UTC+9)
        const offsetKST = 9 * 60; // 9 hours in minutes
        const nowKST = new Date(nowUTC.getTime() + offsetKST * 60000);

        // Create a new date object for the start of the day in KST
        const todayStartKST = new Date(nowKST);
        todayStartKST.setHours(0, 0, 0, 0);

        // Adjust back to UTC
        const todayStartUTC = new Date(todayStartKST.getTime() - offsetKST * 60000);

        // Create a new date object for the end of the day in KST
        const todayEndKST = new Date(nowKST);
        todayEndKST.setHours(23, 59, 59, 999);

        // Adjust back to UTC
        const todayEndUTC = new Date(todayEndKST.getTime() - offsetKST * 60000);

        // Query using the UTC times
        return await this.pushEventRepository.readPushEventsByCreatedAt(githubUsername, todayStartUTC, todayEndUTC);
    }
}
