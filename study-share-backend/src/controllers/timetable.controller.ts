import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { successResponse, errorResponse } from '../utils/responses';
import TimetableEntry from '../models/TimetableEntry';

export const getTimetableEntries = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const entries = await TimetableEntry.find({ userId: req.user!._id }).sort({ day: 1, startTime: 1 });
    res.json(successResponse(entries));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to fetch timetable entries', error));
  }
};

export const createTimetableEntry = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const entry = await TimetableEntry.create({
      ...req.body,
      userId: req.user!._id
    });
    res.status(201).json(successResponse(entry));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to create timetable entry', error));
  }
};

export const updateTimetableEntry = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const entry = await TimetableEntry.findOneAndUpdate(
      { _id: id, userId: req.user!._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!entry) {
      res.status(404).json(errorResponse('Timetable entry not found'));
      return;
    }

    res.json(successResponse(entry));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to update timetable entry', error));
  }
};

export const deleteTimetableEntry = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const entry = await TimetableEntry.findOneAndDelete({ _id: id, userId: req.user!._id });

    if (!entry) {
      res.status(404).json(errorResponse('Timetable entry not found'));
      return;
    }

    res.json(successResponse({ message: 'Timetable entry deleted successfully' }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to delete timetable entry', error));
  }
};

