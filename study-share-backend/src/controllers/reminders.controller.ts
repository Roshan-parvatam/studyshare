import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responses';
import { getPaginationParams } from '../utils/pagination';
import Reminder from '../models/Reminder';

export const getReminders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const [reminders, total] = await Promise.all([
      Reminder.find({ userId: req.user!._id }).skip(skip).limit(limit).sort({ reminderDate: 1 }),
      Reminder.countDocuments({ userId: req.user!._id })
    ]);
    res.json(paginatedResponse(reminders, total, page, limit));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to fetch reminders', error));
  }
};

export const createReminder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const reminderData = {
      ...req.body,
      userId: req.user!._id,
      reminderDate: new Date(req.body.reminderDate)
    } as any;
    const reminder = await Reminder.create(reminderData);
    res.status(201).json(successResponse(reminder));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to create reminder', error));
  }
};

export const updateReminder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: any = { ...req.body };
    if (updateData.reminderDate) updateData.reminderDate = new Date(updateData.reminderDate);
    const reminder = await Reminder.findOneAndUpdate(
      { _id: id, userId: req.user!._id },
      updateData,
      { new: true, runValidators: true }
    );
    if (!reminder) {
      res.status(404).json(errorResponse('Reminder not found'));
      return;
    }
    res.json(successResponse(reminder));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to update reminder', error));
  }
};

export const deleteReminder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const reminder = await Reminder.findOneAndDelete({ _id: id, userId: req.user!._id });
    if (!reminder) {
      res.status(404).json(errorResponse('Reminder not found'));
      return;
    }
    res.json(successResponse({ message: 'Reminder deleted successfully' }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to delete reminder', error));
  }
};

