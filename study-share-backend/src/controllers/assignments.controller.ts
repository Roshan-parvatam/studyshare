import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responses';
import { getPaginationParams } from '../utils/pagination';
import Assignment from '../models/Assignment';

export const getAssignments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query as { status?: string };
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const filter: any = { userId: req.user!._id };
    if (status) filter.status = status;

    const [assignments, total] = await Promise.all([
      Assignment.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Assignment.countDocuments(filter)
    ]);
    res.json(paginatedResponse(assignments, total, page, limit));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to fetch assignments', error));
  }
};

export const createAssignment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const assignmentData: any = { ...req.body, userId: req.user!._id };
    if (assignmentData.dueDate) assignmentData.dueDate = new Date(assignmentData.dueDate);
    const assignment = await Assignment.create(assignmentData);
    res.status(201).json(successResponse(assignment));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to create assignment', error));
  }
};

export const updateAssignment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: any = { ...req.body };
    if (updateData.dueDate) updateData.dueDate = new Date(updateData.dueDate);
    const assignment = await Assignment.findOneAndUpdate(
      { _id: id, userId: req.user!._id },
      updateData,
      { new: true, runValidators: true }
    );
    if (!assignment) {
      res.status(404).json(errorResponse('Assignment not found'));
      return;
    }
    res.json(successResponse(assignment));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to update assignment', error));
  }
};

export const deleteAssignment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findOneAndDelete({ _id: id, userId: req.user!._id });
    if (!assignment) {
      res.status(404).json(errorResponse('Assignment not found'));
      return;
    }
    res.json(successResponse({ message: 'Assignment deleted successfully' }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to delete assignment', error));
  }
};

