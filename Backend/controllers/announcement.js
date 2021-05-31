import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import mongoose from 'mongoose';

import Announcement from '../models/announcement.js';
import Classroom from '../models/classroom.js';

export let addAnnouncement = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.classId);
    if (!classroom) {
      const error = new Error('Class cannot be found');
      error.statusCode = 404;
      throw error;
    }

    const content = req.body.content;
    const classroomId = classroom._id;
    const author = mongoose.Types.ObjectId(req.userId);
    const announcement = new Announcement({
      content,
      class: classroomId,
      author,
    });
    if (req.files) {
      announcement.attachmentUrls = req.files.map((val) => val);
    }
    const result = await announcement.save();
    classroom.announcements.push(announcement);
    await classroom.save();
    res
      .status(201)
      .json({ message: 'Announcement Created', announcement: result });
  } catch (err) {
    next(err);
  }
};

export let getAnnouncement = async (req, res, next) => {
  try {
    const announcement = Announcement.findById(req.params.announcementId);
    if (!announcement) {
      const error = new Error('Announcement cannot be found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ message: 'Announcement fetched', announcement });
  } catch (err) {
    next(err);
  }
};

export let updateAnnouncement = async (req, res, next) => {
  try {
    const announcement = Announcement.findById(req.params.announcementId);
    if (!announcement) {
      const error = new Error('Announcement cannot be found');
      error.statusCode = 404;
      throw error;
    }
    if (announcement.author.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    announcement.content = req.body.content;
    if (req.body.dueDate) {
      announcement.dueDate = req.body.dueDate;
    }
    if (req.files) {
      for (let url of announcement.attachmentUrls) {
        clearFile(url);
      }
      announcement.attachmentUrls = req.files.map((val) => val);
    }
    const result = await announcement.save();
    res
      .status(200)
      .json({ message: 'Announcement Updated', announcement: result });
  } catch (err) {
    next(err);
  }
};

export let deleteAnnouncement = async (req, res, next) => {
  const announcementId = req.params.announcementId;
  const classId = req.params.classId;
  try {
    const announcement = Announcement.findById(announcementId);
    if (!announcement) {
      const error = new Error('Announcement cannot be found');
      error.statusCode = 404;
      throw error;
    }
    const classroom = Classroom.findById(classId);
    if (!classroom) {
      const error = new Error('Classroom cannot be found');
      error.statusCode = 404;
      throw error;
    }
    if (announcement.author.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    if (announcement.attachmentUrls) {
      for (let url of announcement.attachmentUrls) {
        clearFile(url);
      }
    }
    await Announcement.findByIdAndRemove(announcementId);
    classroom.announcement.pull(announcementId);
    await classroom.save();

    res.status(200).json({ message: 'Announcement Deleted' });
  } catch (err) {
    next(err);
  }
};

const clearFile = (filePath) => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
