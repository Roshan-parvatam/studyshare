import { Router } from 'express';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember
} from '../controllers/projects.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { 
  createProjectSchema, 
  updateProjectSchema,
  addProjectMemberSchema 
} from '../validators/projects.schema';

const router = Router();

router.use(authenticate);

router.get('/', getProjects);
router.post('/', validate(createProjectSchema), createProject);
router.put('/:id', validate(updateProjectSchema), updateProject);
router.delete('/:id', deleteProject);
router.post('/:id/members', validate(addProjectMemberSchema), addProjectMember);
router.delete('/:id/members/:userId', removeProjectMember);

export default router;

