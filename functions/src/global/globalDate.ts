export class GlobalDate {
    // 총 커밋 가져오는 기준
    public eventStartDate = new Date(2023, 11, 20);
    // 28일 커밋 가져오는 기준
    public trackingBeginDate = new Date(2024, 0, 1);

    // 해당 시간도 00시가 아닌 09시로 설정하고싶으면 생성자 사용
    
    // constructor () {
    //     const KR_TIME_DIFF = 9 * 60 * 60 * 1000;

    //     const date1 = new Date(2023, 11, 20);
    //     const utc = date1.getTime() + (date1.getTimezoneOffset() * 60 * 1000);
    //     this.eventStartDate = new Date(utc+KR_TIME_DIFF);

    //     const date2 = new Date(2024, 0, 1);
    //     const utc2 = date2.getTime() + (date2.getTimezoneOffset() * 60 * 1000);
    //     this.trackingBeginDate = new Date(utc2+KR_TIME_DIFF);
    // }
}
