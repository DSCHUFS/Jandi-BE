import {Service} from "typedi";
import FirestoreRepository from "../lib/FirestoreRepository";
import {FirebaseConverterMode} from "../lib/FirebaseConverterMode";
import {CrawlingStatus} from "../model/CrawlingStatus";

@Service()
export class CrawlingStatusRepository extends FirestoreRepository {
    statusConverter = (mode: FirebaseConverterMode) => ({
        toFirestore: (data: CrawlingStatus) => {
            const target: any = {...data};
            return target;
        },
        fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot): CrawlingStatus => {
            const data = snap.data();
            return {
                lastUpdatedAt: data.lastUpdatedAt.toDate(),
            };
        },
    });

    async createStatus(status: CrawlingStatus) {
        await this.db.collection("crawlingStatus")
            .withConverter(this.statusConverter(FirebaseConverterMode.MODE_CREATE))
            .doc("main")
            .set(status);
    }

    async getStatus(): Promise<CrawlingStatus | undefined> {
        return (await this.db.collection("crawlingStatus")
            .withConverter(this.statusConverter(FirebaseConverterMode.MODE_READ))
            .doc("main")
            .get()).data();
    }
}
