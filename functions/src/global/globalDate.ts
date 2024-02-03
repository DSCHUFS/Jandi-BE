export class GlobalDate {
    // 총 커밋 가져오는 기준
    public DATE_EVENT_START = "2024-01-30";
    // 28일 커밋 가져오는 기준
    public DATE_TRACKING_BEGIN = "2024-01-30";
}

export function toKSTDate(dateString: string) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day, 9, 0, 0));
}

export function addDays(date: Date, day: number) {
    const newDate = new Date(date.getTime());
    newDate.setDate(newDate.getDate() + day);
    return newDate;
}

export function getCurrentKSTDate(): Date {
    const now = new Date();
    const kstOffset = 9 * 60;
    return new Date(now.getTime() + kstOffset * 60000);
}
