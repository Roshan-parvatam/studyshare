import { z } from 'zod';

export const createTimetableEntrySchema = z.object({
  body: z.object({
    subject: z.string().min(1, 'Subject is required').max(100).trim(),
    day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
    startTime: z.string().min(3),
    endTime: z.string().min(3),
    location: z.string().max(200).optional(),
    color: z.string().optional()
  })
});

export const updateTimetableEntrySchema = z.object({
  body: z.object({
    subject: z.string().max(100).trim().optional(),
    day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']).optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    location: z.string().max(200).optional(),
    color: z.string().optional()
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format')
  })
});

