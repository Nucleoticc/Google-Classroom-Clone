import { Router } from 'express';

import {
  addAnnouncement,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcement.js';
import isAuth from '../middleware/is-auth.js';

const router = Router();

router.get('/:announcementId', isAuth, getAnnouncement);
router.post('/create/:classId', isAuth, addAnnouncement);
router.put('/update/:classId/:announcementId', isAuth, updateAnnouncement);
router.delete('/delete/:classId/:announcementId', isAuth, deleteAnnouncement);

export default router;
