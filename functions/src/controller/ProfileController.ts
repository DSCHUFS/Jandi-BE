import {Controller, Get} from "routing-controllers";
import {Service} from "typedi";
import {prepareResponse} from "../lib/ApiResponse";

@Controller("/profiles")
@Service()
export class ProfileController {
    @Get("/")
    async getAll() {
        return prepareResponse([], "");
    }
}
