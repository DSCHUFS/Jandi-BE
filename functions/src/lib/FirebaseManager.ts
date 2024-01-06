import {auth, firestore} from "firebase-admin";
import {App, initializeApp} from "firebase-admin/app";
import Firestore = firestore.Firestore;
import Auth = auth.Auth;
import {Service} from "typedi";
import {getFirestore} from "firebase-admin/firestore";
import {getAuth} from "firebase-admin/auth";
import {getStorage, Storage} from "firebase-admin/storage";

@Service()
export class FirebaseManager {
    private readonly app: App;
    public readonly firestore: Firestore;
    public readonly auth: Auth;
    public readonly storage: Storage;

    constructor() {
        this.app = initializeApp();
        this.firestore = getFirestore(this.app);
        this.firestore.settings({ignoreUndefinedProperties: true});
        this.auth = getAuth(this.app);
        this.storage = getStorage(this.app);
    }
}
