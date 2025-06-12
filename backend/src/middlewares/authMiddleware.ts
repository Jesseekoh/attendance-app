import { Request, Response, NextFunction } from 'express';
import { auth } from '../utils/auth';
import { fromNodeHeaders } from 'better-auth/node';
import { APIError } from 'better-auth';
import logger from '../utils/logger';

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session || !session.user) {
      res
        .status(401)
        .json({ sucess: 'false', message: 'Unauthorized. Please sign in.' });
      return;
    }

    req.user = session?.user;
    next();
  } catch (error) {
    logger.error('Error in authenticateToken middleware:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
