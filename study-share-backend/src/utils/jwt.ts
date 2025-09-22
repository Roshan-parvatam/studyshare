import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { env } from '../config/env';

export interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};

export const setTokenCookie = (res: Response, token: string): void => {
  const cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production' ? env.COOKIE_SECURE : false,
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    domain: env.NODE_ENV === 'production' ? env.COOKIE_DOMAIN : undefined,
  };

  res.cookie('accessToken', token, cookieOptions);
};

export const clearTokenCookie = (res: Response): void => {
  const cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production' ? env.COOKIE_SECURE : false,
    sameSite: 'lax' as const,
    domain: env.NODE_ENV === 'production' ? env.COOKIE_DOMAIN : undefined,
  };

  res.clearCookie('accessToken', cookieOptions);
};

