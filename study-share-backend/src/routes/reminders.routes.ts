import { Router } from 'express';
import {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder
} from '../controllers/reminders.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createReminderSchema, updateReminderSchema } from '../validators/reminders.schema';

const router = Router();

router.use(authenticate);

router.get('/', getReminders);
router.post('/', validate(createReminderSchema), createReminder);
router.put('/:id', validate(updateReminderSchema), updateReminder);
router.delete('/:id', deleteReminder);

export default router;

