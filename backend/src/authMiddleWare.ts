import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Unauthorized. Please log in' });

        return;
    }
    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!secret) {
        throw new Error('Access Token is not defined');
    }
    const user = jwt.verify(token, secret) as string | JwtPayload;
    console.log(user);
    req.user = user;
    next();
};
