
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { AppError } from '@/errors/AppError';

interface AuthTokenPayload {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new AppError({
      message: 'Authorization token is required',
      statusCode: 401,
      code: 'TOKEN_REQUIRED',
    });
  }

  const [type, token] = authorization.split(' ');

  if (type !== 'Bearer' || !token) {
    throw new AppError({
      message: 'Invalid authorization format',
      statusCode: 401,
      code: 'INVALID_TOKEN',
    });
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new AppError({
      message: 'JWT secret is not configured',
      statusCode: 500,
      code: 'JWT_SECRET_NOT_CONFIGURED',
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (
      typeof decoded !== 'object' ||
      decoded === null ||
      !('id' in decoded) ||
      !('email' in decoded) ||
      !('role' in decoded)
    ) {
      throw new AppError({
        message: 'Invalid token payload',
        statusCode: 401,
        code: 'INVALID_TOKEN',
      });
    }

    req.user = {
      id: String(decoded.id),
      email: String(decoded.email),
      role: String(decoded.role),
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError({
      message: 'Invalid or expired token',
      statusCode: 401,
      code: 'INVALID_TOKEN',
    });
  }
}
