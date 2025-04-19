import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import {
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../utils/helper';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken && !refreshToken) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized. Please log in',
    });
    return;
  }

  let user = verifyAccessToken(accessToken);

  if (user) {
    req.user = user;
    next();
  } else {
    const decodedRefreshToken = verifyRefreshToken(refreshToken);

    if (!decodedRefreshToken) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.status(401).json({
        success: false,
        message: 'Unauthorized. Please log in',
      });
      return;
    }

    user = decodedRefreshToken as JwtPayload;

    const newToken = generateAccessToken({ role: user.role, id: user.id });
    res.cookie('accessToken', newToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000,
    });

    req.user = user;
    next();
  }
};
