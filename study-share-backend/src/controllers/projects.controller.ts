import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responses';
import { getPaginationParams } from '../utils/pagination';
import Project from '../models/Project';
import mongoose from 'mongoose';

export const getProjects = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query as { status?: string };
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const filter: any = {
      $or: [
        { createdBy: req.user!._id },
        { members: req.user!._id }
      ]
    };
    if (status) filter.status = status;

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .populate('createdBy', 'name email')
        .populate('members', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Project.countDocuments(filter)
    ]);

    res.json(paginatedResponse(projects, total, page, limit));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to fetch projects', error));
  }
};

export const createProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const projectData: any = {
      ...req.body,
      createdBy: req.user!._id,
      members: req.body.members || []
    };
    if (projectData.dueDate) projectData.dueDate = new Date(projectData.dueDate);
    if (!projectData.members.includes(req.user!._id)) {
      projectData.members.push(req.user!._id);
    }
    const project = await Project.create(projectData);
    await project.populate('createdBy', 'name email');
    await project.populate('members', 'name email');
    res.status(201).json(successResponse(project));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to create project', error));
  }
};

export const updateProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: any = { ...req.body };
    if (updateData.dueDate) updateData.dueDate = new Date(updateData.dueDate);
    const project = await Project.findOneAndUpdate(
      { _id: id, createdBy: req.user!._id },
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email').populate('members', 'name email');
    if (!project) {
      res.status(404).json(errorResponse('Project not found or you are not authorized to update it'));
      return;
    }
    res.json(successResponse(project));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to update project', error));
  }
};

export const deleteProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const project = await Project.findOneAndDelete({ _id: id, createdBy: req.user!._id });
    if (!project) {
      res.status(404).json(errorResponse('Project not found or you are not authorized to delete it'));
      return;
    }
    res.json(successResponse({ message: 'Project deleted successfully' }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to delete project', error));
  }
};

export const addProjectMember = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.body as { userId: string };
    const project = await Project.findOne({ _id: id, createdBy: req.user!._id });
    if (!project) {
      res.status(404).json(errorResponse('Project not found or you are not authorized to modify it'));
      return;
    }
    if (project.members.includes(new mongoose.Types.ObjectId(userId))) {
      res.status(409).json(errorResponse('User is already a member of this project'));
      return;
    }
    project.members.push(new mongoose.Types.ObjectId(userId));
    await project.save();
    await project.populate('createdBy', 'name email');
    await project.populate('members', 'name email');
    res.json(successResponse(project));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to add project member', error));
  }
};

export const removeProjectMember = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id, userId } = req.params as { id: string; userId: string };
    const project = await Project.findOne({ _id: id, createdBy: req.user!._id });
    if (!project) {
      res.status(404).json(errorResponse('Project not found or you are not authorized to modify it'));
      return;
    }
    project.members = project.members.filter(memberId => memberId.toString() !== userId);
    await project.save();
    await project.populate('createdBy', 'name email');
    await project.populate('members', 'name email');
    res.json(successResponse(project));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to remove project member', error));
  }
};

