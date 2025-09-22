import { Router } from 'express';
import {
  getNotes,
  getSharedNotes,
  createNote,
  updateNote,
  deleteNote
} from '../controllers/notes.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createNoteSchema, updateNoteSchema } from '../validators/notes.schema';

const router = Router();

router.use(authenticate);

router.get('/', getNotes);
router.get('/shared', getSharedNotes);
router.post('/', validate(createNoteSchema), createNote);
router.put('/:id', validate(updateNoteSchema), updateNote);
router.delete('/:id', deleteNote);

export default router;

