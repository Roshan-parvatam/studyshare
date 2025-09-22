import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { errorResponse } from '../utils/responses';
import User from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
    university: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = (req as any).cookies?.accessToken;

    if (!token) {
      res.status(401).json(errorResponse('Access denied. No token provided.'));
      return;
    }

    const decoded = verifyToken(token) as JwtPayload;
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      res.status(401).json(errorResponse('Invalid token. User not found.'));
      return;
    }

    req.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      university: user.university
    };

    next();
  } catch (error) {
    if (error instanceof Error) {
      if ((error as any).name === 'TokenExpiredError') {
        res.status(401).json(errorResponse('Token expired. Please login again.'));
        return;
      }
      if ((error as any).name === 'JsonWebTokenError') {
        res.status(401).json(errorResponse('Invalid token format.'));
        return;
      }
    }
    res.status(401).json(errorResponse('Invalid token.'));
  }
};

