import { z } from 'zod';

export const createNoteSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200).trim(),
    content: z.string().max(10000).optional(),
    subject: z.string().max(100).trim().optional(),
    isPublic: z.boolean().optional(),
    tags: z.array(z.string().max(50).trim()).optional()
  })
});

export const updateNoteSchema = z.object({
  body: z.object({
    title: z.string().max(200).trim().optional(),
    content: z.string().max(10000).optional(),
    subject: z.string().max(100).trim().optional(),
    isPublic: z.boolean().optional(),
    tags: z.array(z.string().max(50).trim()).optional()
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format')
  })
});

