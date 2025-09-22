import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responses';
import { getPaginationParams } from '../utils/pagination';
import Note from '../models/Note';

export const getNotes = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const [notes, total] = await Promise.all([
      Note.find({ userId: req.user!._id }).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Note.countDocuments({ userId: req.user!._id })
    ]);
    res.json(paginatedResponse(notes, total, page, limit));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to fetch notes', error));
  }
};

export const getSharedNotes = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const notes = await Note.find({
      $or: [
        { isPublic: true },
        { sharedWith: req.user!._id }
      ]
    }).populate('userId', 'name university').sort({ createdAt: -1 });
    res.json(successResponse(notes));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to fetch shared notes', error));
  }
};

export const createNote = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const note = await Note.create({
      ...req.body,
      userId: req.user!._id
    });
    res.status(201).json(successResponse(note));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to create note', error));
  }
};

export const updateNote = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const note = await Note.findOneAndUpdate(
      { _id: id, userId: req.user!._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!note) {
      res.status(404).json(errorResponse('Note not found'));
      return;
    }

    res.json(successResponse(note));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to update note', error));
  }
};

export const deleteNote = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const note = await Note.findOneAndDelete({ _id: id, userId: req.user!._id });
    if (!note) {
      res.status(404).json(errorResponse('Note not found'));
      return;
    }
    res.json(successResponse({ message: 'Note deleted successfully' }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to delete note', error));
  }
};

