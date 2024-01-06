import {firestore} from "firebase-admin";
import Firestore = firestore.Firestore;
import {Service} from "typedi";
import {FirebaseManager} from "./FirebaseManager";

@Service()
export default class FirestoreRepository {
    protected db: Firestore;

    constructor(firebaseManager: FirebaseManager) {
        this.db = firebaseManager.firestore;
    }
}
