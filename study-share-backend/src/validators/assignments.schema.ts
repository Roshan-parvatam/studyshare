import { z } from 'zod';

export const createAssignmentSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200).trim(),
    description: z.string().max(2000).optional(),
    subject: z.string().max(100).trim().optional(),
    dueDate: z.string().datetime().optional(),
    status: z.enum(['pending', 'in-progress', 'completed']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional()
  })
});

export const updateAssignmentSchema = z.object({
  body: z.object({
    title: z.string().max(200).trim().optional(),
    description: z.string().max(2000).optional(),
    subject: z.string().max(100).trim().optional(),
    dueDate: z.string().datetime().optional(),
    status: z.enum(['pending', 'in-progress', 'completed']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional()
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format')
  })
});

export const getAssignmentsSchema = z.object({
  query: z.object({
    status: z.enum(['pending', 'in-progress', 'completed']).optional(),
    page: z.string().optional(),
    limit: z.string().optional()
  })
});

