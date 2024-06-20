import { NextFunction, Request, Response } from "express";
import { ControllerType } from "./types/types.js";
import ErrorHandler from "./error-utility.js";

const errorHandler = (err:ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    err.message ||= "Internal error occurred!",
    err.statusCode ||= 500;

    return res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
}

const tryCatch = (func:ControllerType) => (req:Request, res:Response, next:NextFunction) => {
    return Promise.resolve(func(req, res, next)).catch(next);
}

export {tryCatch, errorHandler};