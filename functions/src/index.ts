import "reflect-metadata";

// this shim is required
import {
    createExpressServer,
    ExpressErrorMiddlewareInterface,
    HttpError,
    Middleware,
    useContainer,
} from "routing-controllers";
import {onRequest} from "firebase-functions/v2/https";
import {Container, Service} from "typedi";
import {Request, Response, NextFunction} from "express";
import {prepareResponse} from "./lib/ApiResponse";
import {ProfileController} from "./controller/profile/ProfileController";
import {scheduledFunction} from "./scheduledTasks";
import {onSchedule} from "firebase-functions/v2/scheduler";

import {setGlobalOptions} from "firebase-functions/v2";

setGlobalOptions({region: "asia-northeast3"});

useContainer(Container);

@Service()
@Middleware({type: "after"})
export class HttpErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: Error, request: Request, response: Response, next: (err: Error) => NextFunction) {
        if (error instanceof HttpError) {
            const res = prepareResponse(undefined, error.message);
            response.status(error.httpCode).send(res);
        } else {
            const res = prepareResponse(undefined, error.message);
            response.status(500).send(res);
        }

        next(error);
    }
}

const app = createExpressServer({
    cors: {
        origin: "*",
    },
    defaultErrorHandler: false,
    middlewares: [HttpErrorHandler],
    controllers: [ProfileController],
});

exports.api = onRequest(app);

exports.scheduledFunctionCrontab = onSchedule({
    schedule: "every 5 minutes",
    timeZone: "Asia/Seoul",
}, scheduledFunction);
