import { Router } from 'express';

import { createClassroom, getClassrooms } from '../controllers/classroom.js';
import isAuth from '../middleware/is-auth.js';

const router = Router();

router.get('/', isAuth, getClassrooms);                    //Get all classrooms
router.post('/create', isAuth, createClassroom);             //Create Classrooms
router.get('/:classid', isAuth);            //Get one Classroom

export default router;
