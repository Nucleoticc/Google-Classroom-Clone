import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

import Classroom from '../models/classroom.js';

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const classroomId = await Classroom.findById(req.body.classroomId);
    if (file.fieldname === 'document') {
      cb(null, `./Files/${classroomId._id.toString()}/documents/`);
    }
    if (file.fieldname === 'image') {
      cb(null, `./Files/${classroomId._id.toString()}/images/`);
    }
    if (file.fieldname === 'video') {
      cb(null, `./Files/${classroomId._id.toString()}/videos/`);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});

export default multer({ storage: fileStorage }).fields([
  { name: 'document', maxCount: 10 },
  { name: 'image', maxCount: 10 },
  { name: 'video', maxCount: 10 },
]);
