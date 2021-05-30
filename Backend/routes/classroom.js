import { Router } from 'express';

import {
  createClassroom,
  getClassrooms,
  getClassroom,
  updateClassroom,
  deleteClassroom,
} from '../controllers/classroom.js';
import {
  addTeacher,
  addStudent,
  removeTeacher,
  removeStudentAuthor,
  removeStudentSelf,
} from '../controllers/classroomUsers.js';
import isAuth from '../middleware/is-auth.js';

const router = Router();

// Main classroom Routes
router.get('/', isAuth, getClassrooms);
router.get('/:classId', isAuth, getClassroom);
router.post('/create', isAuth, createClassroom);
router.put('/update/:classId', isAuth, updateClassroom);
router.delete('/delete/:classId', isAuth, deleteClassroom);

// Member related Classroom Routes
router.patch('/addTeacher/:classId', isAuth, addTeacher);
router.patch('/addStudent/:classId', isAuth, addStudent);
router.patch('/removeTeacher/:classId', isAuth, removeTeacher);
router.patch('/LeaveClassroom/:classId', isAuth, removeStudentSelf);
router.patch('/removeStudent/:classId', isAuth, removeStudentAuthor);

export default router;
