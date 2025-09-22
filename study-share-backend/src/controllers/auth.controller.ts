import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken, setTokenCookie, clearTokenCookie } from '../utils/jwt';
import { successResponse, errorResponse } from '../utils/responses';
import { AuthenticatedRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, university, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json(errorResponse('User already exists with this email'));
      return;
    }

    const user = await User.create({ name, email, university, password });
    const token = generateToken(user._id.toString());
    setTokenCookie(res, token);

    res.status(201).json(successResponse({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        university: user.university
      }
    }));
  } catch (error) {
    res.status(500).json(errorResponse('Registration failed', error));
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json(errorResponse('Invalid email or password'));
      return;
    }

    const token = generateToken(user._id.toString());
    setTokenCookie(res, token);

    res.json(successResponse({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        university: user.university
      }
    }));
  } catch (error) {
    res.status(500).json(errorResponse('Login failed', error));
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  clearTokenCookie(res);
  res.json(successResponse({ message: 'Logged out successfully' }));
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  res.json(successResponse({ user: req.user }));
};


