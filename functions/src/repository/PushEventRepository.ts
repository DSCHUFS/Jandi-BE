import {Service} from "typedi";
import FirestoreRepository from "../lib/FirestoreRepository";
import {FirebaseConverterMode} from "../lib/FirebaseConverterMode";
import {ProfilePushEvent} from "../model/ProfilePushEvent";

@Service()
export class PushEventRepository extends FirestoreRepository {
    pushEventConverter = (mode: FirebaseConverterMode) => ({
        toFirestore: (data: ProfilePushEvent) => {
            const target: any = {...data};
            return target;
        },
        fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot): ProfilePushEvent => {
            const data = snap.data();
            return {
                id: data.id,
                repositoryName: data.repositoryName,
                repositoryUrl: data.repositoryUrl,
                createdAt: data.createdAt.toDate(),
            };
        },
    });

    async createPushEvent(githubUsername: string, pushEvent: ProfilePushEvent) {
        await this.db.collection("profiles").doc(githubUsername)
            .collection("pushEvents")
            .doc(pushEvent.id)
            .withConverter(this.pushEventConverter(FirebaseConverterMode.MODE_CREATE))
            .set(pushEvent);
    }

    async readPushEvents(githubUsername: string): Promise<ProfilePushEvent[]> {
        const snapshot = await this.db.collection("profiles").doc(githubUsername)
            .collection("pushEvents")
            .withConverter(this.pushEventConverter(FirebaseConverterMode.MODE_READ))
            .get();
        return snapshot.docs.map((doc) => doc.data());
    }

    async isPushEventExist(githubUsername: string, pushEventId: string): Promise<boolean> {
        const doc = await this.db.collection("profiles").doc(githubUsername)
            .collection("pushEvents")
            .doc(pushEventId)
            .get();
        return doc.exists;
    }

    async readPushEventsByCreatedAt(githubUsername: string, from: Date, to: Date): Promise<ProfilePushEvent[]> {
        const snapshot = await this.db.collection("profiles").doc(githubUsername)
            .collection("pushEvents")
            .where("createdAt", ">=", from)
            .where("createdAt", "<=", to)
            .orderBy("createdAt", "desc")
            .withConverter(this.pushEventConverter(FirebaseConverterMode.MODE_READ))
            .get();
        return snapshot.docs.map((doc) => doc.data());
    }
}
