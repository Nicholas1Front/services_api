import type {
    NextFunction,
    Request,
    Response
} from 'express';

import { AppError} from '@/errors/AppError';
import { logger } from '@/config/logger';

export function errorHandler(
    error : Error,
    request : Request,
    response : Response,
    next : NextFunction
){
    if(error instanceof AppError){
        logger.warn({
            method : request.method,
            path : request.originalUrl,
            code : error.code,
            message : error.message
        });

        return response.status(error.statusCode).json({
            success : false,
            code : error.code,
            message : error.message,
            details : error.details,
            timestamp : new Date().toISOString()
        })
    }

    logger.error({
        method : request.method,
        path : request.originalUrl,
        error
    })

    return response.status(500).json({
        success : false,
        code : 'INTERNAL_SERVER_ERROR',
        message : 'Internal Server Error',
        timestamp : new Date().toISOString()
    })
}