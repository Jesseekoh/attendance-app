import jwt from 'jsonwebtoken';
import { ITokenPayload } from '../types';
export function generateAccessToken({ id, role }: ITokenPayload) {
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!secret) {
    throw new Error('Access JWT secret is not defined');
  }
  return jwt.sign({ id, role }, secret, { expiresIn: '15m' });
}

export function generateRefreshToken({ id, role }: ITokenPayload) {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) {
    throw new Error('Refresh JWT secret is not defined');
  }
  return jwt.sign({ role, id }, secret, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string) {
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string) {
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
}
