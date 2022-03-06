import { Request, Response } from 'express';
import {
    default as createResponse,
    default as responseGenerator,
} from '../utility/responseGenerator';

export const errorHandler = (err: any, req: Request, res: Response) => {
    if (err) {
        let statusCode = 500;
        if (err.name == 'ValidationError') {
            statusCode = 400;
        }
        const errorPaths = Object.keys(err.errors || {});
        const errorMessages = errorPaths.map(
            (path) => err.errors[path].properties.message
        );
        const errorMessage = errorMessages.join(', ') || err.message;
        console.log(
            `Error: ${req.method} request from ${req.ip} on route ${req.path}`,
            'red'
        );
        console.log(errorMessage);
        res.status(statusCode).json(createResponse(null, errorMessage, true));
    }
};

export const notFound = (req: Request, res: Response) => {
    res.status(404).json(
        responseGenerator(
            'not found',
            `Can't find ${req.originalUrl} on this server.`,
            true
        )
    );
};

// {
//     status: 'failed',
//     message: `Can't find ${req.originalUrl} on this server.`,
// }
