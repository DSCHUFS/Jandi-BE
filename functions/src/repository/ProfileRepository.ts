import {Service} from "typedi";
import FirestoreRepository from "../lib/FirestoreRepository";

@Service()
export class ProfileRepository extends FirestoreRepository {
}