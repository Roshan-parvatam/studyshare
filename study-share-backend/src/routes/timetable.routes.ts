import { Router } from 'express';
import {
  getTimetableEntries,
  createTimetableEntry,
  updateTimetableEntry,
  deleteTimetableEntry
} from '../controllers/timetable.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createTimetableEntrySchema, updateTimetableEntrySchema } from '../validators/timetable.schema';

const router = Router();

router.use(authenticate);

router.get('/', getTimetableEntries);
router.post('/', validate(createTimetableEntrySchema), createTimetableEntry);
router.put('/:id', validate(updateTimetableEntrySchema), updateTimetableEntry);
router.delete('/:id', deleteTimetableEntry);

export default router;

