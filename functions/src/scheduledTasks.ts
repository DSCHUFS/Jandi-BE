import {ScheduledEvent} from "firebase-functions/v2/scheduler";
import {Container} from "typedi";
import {ScheduledSynchronizeService} from "./service/ScheduledSynchronizeService";

export const scheduledFunction = async (event: ScheduledEvent) => {
    const scheduledSynchronizeService = Container.get(ScheduledSynchronizeService);
    await scheduledSynchronizeService.synchronize();
};
