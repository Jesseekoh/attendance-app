import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: any; // or a custom User type
        }
    }
}

export {};
