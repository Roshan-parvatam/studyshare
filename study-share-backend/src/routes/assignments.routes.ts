import { Router } from 'express';
import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment
} from '../controllers/assignments.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { 
  createAssignmentSchema, 
  updateAssignmentSchema, 
  getAssignmentsSchema 
} from '../validators/assignments.schema';

const router = Router();

router.use(authenticate);

router.get('/', validate(getAssignmentsSchema), getAssignments);
router.post('/', validate(createAssignmentSchema), createAssignment);
router.put('/:id', validate(updateAssignmentSchema), updateAssignment);
router.delete('/:id', deleteAssignment);

export default router;

