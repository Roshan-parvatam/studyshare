import { z } from 'zod';

export const createReminderSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200).trim(),
    description: z.string().max(1000).optional(),
    reminderDate: z.string().datetime('Invalid date format')
  })
});

export const updateReminderSchema = z.object({
  body: z.object({
    title: z.string().max(200).trim().optional(),
    description: z.string().max(1000).optional(),
    reminderDate: z.string().datetime().optional(),
    isCompleted: z.boolean().optional()
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format')
  })
});

