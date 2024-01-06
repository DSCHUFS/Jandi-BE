import {Service} from "typedi";
import FirestoreRepository from "../lib/FirestoreRepository";
import {FirebaseConverterMode} from "../lib/FirebaseConverterMode";
import {Profile} from "../model/Profile";
import {FieldValue} from "firebase-admin/firestore";

@Service()
export class ProfileRepository extends FirestoreRepository {
    profileConverter = (mode: FirebaseConverterMode) => ({
        toFirestore: (data: Profile) => {
            const target: any = {...data};
            if (mode === FirebaseConverterMode.MODE_CREATE) {
                target.createdAt = FieldValue.serverTimestamp();
                target.modifiedAt = FieldValue.serverTimestamp();
            } else if (mode === FirebaseConverterMode.MODE_UPDATE) {
                target.modifiedAt = FieldValue.serverTimestamp();
            }
            return target;
        },
        fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot): Profile => {
            const data = snap.data();
            return {
                name: data.name,
                githubUsername: data.githubUsername,
                websiteUrl: data.websiteUrl,
                totalCommitCounts: data.totalCommitCounts,
                last28daysContributionCounts: data.last28daysContributionCounts.length == 28 ?
                    data.last28daysContributionCounts : new Array(28).fill(0),
                latestPushedAt: data.latestPushedAt ? data.latestPushedAt.toDate() : data.latestPushedAt,
                createdAt: data.createdAt.toDate(),
                modifiedAt: data.modifiedAt.toDate(),
            };
        },
    });

    async createProfile(profile: Profile) {
        await this.db.collection("profiles")
            .withConverter(this.profileConverter(FirebaseConverterMode.MODE_CREATE))
            .doc(profile.githubUsername)
            .set(profile);
    }

    async getProfile(githubUsername: string): Promise<Profile | undefined> {
        return (await this.db.collection("profiles")
            .withConverter(this.profileConverter(FirebaseConverterMode.MODE_READ))
            .doc(githubUsername)
            .get()).data();
    }

    async updateLatestPushedAt(githubUsername: string, latestPushedAt: Date) {
        await this.db.collection("profiles").doc(githubUsername).update({
            latestPushedAt: latestPushedAt,
        });
    }

    async getAllProfiles(): Promise<Profile[]> {
        const snapshot = await this.db.collection("profiles")
            .withConverter(this.profileConverter(FirebaseConverterMode.MODE_READ))
            .get();

        return snapshot.docs.map((doc) => doc.data());
    }
}
