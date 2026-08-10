export interface AppErrorProps {
    message: string;
    statusCode: number;
    code: string;
    details?: any;
}

export class AppError extends Error{
    public readonly statusCode: number;
    public readonly code: string;
    public readonly details?: unknown;

    constructor({
        message,
        statusCode,
        code,
        details
    }:AppErrorProps){
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }
    
}