import {Service} from "typedi";
import {ProfileRepository} from "../repository/ProfileRepository";
import {Profile} from "../model/Profile";

@Service()
export class ProfileService {
    constructor(private profileRepository: ProfileRepository) {
    }

    async readProfile(githubUsername: string): Promise<Profile | undefined> {
        return await this.profileRepository.getProfile(githubUsername);
    }

    async createProfile(profile: Profile) {
        return await this.profileRepository.createProfile(profile);
    }

    async readAllProfiles(): Promise<Profile[]> {
        return await this.profileRepository.getAllProfiles();
    }
}
