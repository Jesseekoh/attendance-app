import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import {
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../utils/helper';
import { auth } from '../utils/auth';
import { fromNodeHeaders } from 'better-auth/node';

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  req.user = session?.user;
  next();
};
