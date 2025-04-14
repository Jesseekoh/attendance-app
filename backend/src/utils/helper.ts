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
