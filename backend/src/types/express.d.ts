import { Request } from 'express';
import { ITokenPayload } from '.';

declare global {
    namespace Express {
        interface Request {
            user?: ITokenPayload; // or a custom User type
        }
    }
}

export {};
