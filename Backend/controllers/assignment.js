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
    await assignment.save();
    classroom.assignments.push(assignment);
    await classroom.save();
    res.status(201).json({ message: 'Assignment Created' });
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

export let editAssignment = async (req, res, next) => {
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
  } catch (err) {
    next(err);
  }
};

// Create update and delete
// Copy over to announcement
// Make Rest APIs
// Test
// Write Tests
// Convert to Typescript
// Do Frontend