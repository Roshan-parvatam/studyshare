import { Router } from 'express';
import authRoutes from './auth.routes';
import timetableRoutes from './timetable.routes';
import notesRoutes from './notes.routes';
import assignmentsRoutes from './assignments.routes';
import projectsRoutes from './projects.routes';
import remindersRoutes from './reminders.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/timetable', timetableRoutes);
router.use('/notes', notesRoutes);
router.use('/assignments', assignmentsRoutes);
router.use('/projects', projectsRoutes);
router.use('/reminders', remindersRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;

