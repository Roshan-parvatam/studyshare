import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/responses';
import { env } from '../config/env';

export interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class AppError extends Error implements CustomError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { message, statusCode = 500 } = error;

  if ((error.message || '').includes('duplicate key error') || (error.message || '').includes('E11000')) {
    message = 'Resource already exists';
    statusCode = 409;
  }

  if ((error as any).name === 'ValidationError') {
    message = 'Invalid data provided';
    statusCode = 400;
  }

  if ((error as any).name === 'CastError') {
    message = 'Invalid ID format';
    statusCode = 400;
  }

  if (env.NODE_ENV === 'development') {
    console.error('Error:', error);
  }

  res.status(statusCode).json(
    errorResponse(
      message,
      env.NODE_ENV === 'development' ? {
        stack: error.stack,
        name: (error as any).name
      } : undefined
    )
  );
};

