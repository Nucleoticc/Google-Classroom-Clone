import { Router } from 'express';

import {
  addAssignment,
  getAssignment,
  updateAssignment,
  deleteAssignment,
} from '../controllers/assignment.js';
import isAuth from '../middleware/is-auth.js';

const router = Router();

router.get('/:assignmentId', isAuth, getAssignment);
router.post('/create/:classId', isAuth, addAssignment);
router.put('/update/:classId/:assignmentId', isAuth, updateAssignment);
router.delete('/delete/:classId/:assignmentId', isAuth, deleteAssignment);

export default router;
