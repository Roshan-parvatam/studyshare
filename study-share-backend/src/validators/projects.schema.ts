import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Project name is required').max(200).trim(),
    description: z.string().max(2000).optional(),
    members: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
    dueDate: z.string().datetime().optional()
  })
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().max(200).trim().optional(),
    description: z.string().max(2000).optional(),
    status: z.enum(['active', 'completed', 'archived']).optional(),
    dueDate: z.string().datetime().optional()
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format')
  })
});

export const addProjectMemberSchema = z.object({
  body: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format')
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format')
  })
});

