import {ScheduledEvent} from "firebase-functions/v2/scheduler";

export const scheduledFunction = async (event : ScheduledEvent) => {
    console.log(event);
};
