import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import mongoose from 'mongoose';

import Assignment from '../models/assignment.js';
import Classroom from '../models/classroom.js';

export let addAssignment = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.classId);
    if (!classroom) {
      const error = new Error('Class cannot be found');
      error.statusCode = 404;
      throw error;
    }
    if (
      classroom.author.toString() !== req.userId ||
      classroom.teachers.includes(userId)
    ) {
      const error = new Error('Unauthorized');
      error.statusCode = 403;
      throw error;
    }

    const title = req.body.title;
    const description = req.body.description;
    const classroomId = classroom._id;
    const author = mongoose.Types.ObjectId(req.userId);
    const assignment = new Assignment({
      title,
      description,
      class: classroomId,
      author,
    });
    if (req.body.dueDate) {
      assignment.dueDate = req.body.dueDate;
    }
    if (req.files) {
      assignment.attachmentUrls = req.files.map((val) => val);
    }
    const result = await assignment.save();
    classroom.assignments.push(assignment);
    await classroom.save();
    res.status(201).json({ message: 'Assignment Created', assignment: result });
  } catch (err) {
    next(err);
  }
};

export let getAssignment = async (req, res, next) => {
  try {
    const assignment = Assignment.findById(req.params.assignmentId);
    if (!assignment) {
      const error = new Error('Assignment cannot be found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ message: 'Assignment fetched', assignment });
  } catch (err) {
    next(err);
  }
};

export let updateAssignment = async (req, res, next) => {
  try {
    const assignment = Assignment.findById(req.params.assignmentId);
    if (!assignment) {
      const error = new Error('Assignment cannot be found');
      error.statusCode = 404;
      throw error;
    }
    if (assignment.author.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    assignment.title = req.body.title;
    assignment.description = req.body.description;
    if (req.body.dueDate) {
      assignment.dueDate = req.body.dueDate;
    }
    if (req.files) {
      for (let url of assignment.attachmentUrls) {
        clearFile(url);
      }
      assignment.attachmentUrls = req.files.map((val) => val);
    }
    const result = await assignment.save();
    res.status(200).json({ message: 'Assignment Updated', assignment: result });
  } catch (err) {
    next(err);
  }
};

export let deleteAssignment = async (req, res, next) => {
  const assignmentId = req.params.assignmentId;
  const classId = req.params.classId;
  try {
    const assignment = Assignment.findById(assignmentId);
    if (!assignment) {
      const error = new Error('Assignment cannot be found');
      error.statusCode = 404;
      throw error;
    }
    const classroom = Classroom.findById(classId);
    if (!classroom) {
      const error = new Error('Classroom cannot be found');
      error.statusCode = 404;
      throw error;
    }
    if (assignment.author.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    if (assignment.attachmentUrls) {
      for (let url of assignment.attachmentUrls) {
        clearFile(url);
      }
    }
    await Assignment.findByIdAndRemove(assignmentId);
    classroom.assignments.pull(assignmentId);
    await classroom.save();

    res.status(200).json({ message: 'Assignment Deleted'});
  } catch (err) {
    next(err);
  }
};

const clearFile = (filePath) => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
