import {IsNotEmpty} from "class-validator";

export class ProfileCreateRequest {
    @IsNotEmpty()
    public name = "";
    @IsNotEmpty()
    public githubUsername = "";
    public websiteUrl = "";
}
