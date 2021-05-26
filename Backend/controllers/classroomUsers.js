import mongoose from 'mongoose';

import Classroom from '../models/classroom.js';

export let addTeacher = (req, res, next) => {
  const classId = req.params.classid;
  const teacherId = req.body.teacherId;

  try {
    const classroom = await Classroom.findById(classId);
    if (!classroom) {
      const error = new Error('Class cannot be found');
      error.statusCode = 404;
      throw error;
    }
    if (classroom.author.toString() !== req.userId) {
      const error = new Error('Not Authorized');
      error.statusCode = 403;
      throw error;
    }
    if (classroom.students.includes(teacherId)) {
      const error = new Error(
        'User is already registered as student in this classroom'
      );
      error.statusCode = 403;
      throw error;
    }
    if (!classroom.teachers.includes(teacherId)) {
      classroom.teachers.push(mongoose.Types.ObjectId(teacherId));
      await classroom.save();
    }
    res.status(200).json({ message: 'Teacher Added' });
  } catch (err) {
    next(err);
  }
};

export let removeTeacher = (req, res, next) => {
  const classId = req.params.classid;
  const teacherId = req.body.teacherId;

  try {
    const classroom = await Classroom.findById(classId);
    if (!classroom) {
      const error = new Error('Class cannot be found');
      error.statusCode = 404;
      throw error;
    }
    if (classroom.author.toString() !== req.userId) {
      const error = new Error('Not Authorized');
      error.statusCode = 403;
      throw error;
    }
    classroom.teachers = classroom.teachers.filter(
      (val) => val.toString() !== teacherId
    );
    await classroom.save();
    res.status(200).json({ message: 'Teacher Removed' });
  } catch (err) {
    next(err);
  }
};

export let addStudent = (req, res, next) => {
  const classCode = req.body.classCode;
  const studentId = req.userId;

  try {
    const classroom = await Classroom.find({ classCode: classCode });
    if (!classroom) {
      const error = new Error('Class cannot be found');
      error.statusCode = 404;
      throw error;
    }
    if (classroom.teachers.includes(studentId)) {
      const error = new Error(
        'You are already registered as teacher in this classroom'
      );
      error.statusCode = 403;
      throw error;
    }
    if (!classroom.students.includes(studentId)) {
      classroom.students.push(mongoose.Types.ObjectId(studentId));
      await classroom.save();
    }
    res.status(200).json({ message: 'Student Added' });
  } catch (err) {
    next(err);
  }
};

export let removeStudentSelf = (req, res, next) => {
  const classId = req.params.classid;
  const studentId = req.userId;

  try {
    const classroom = await Classroom.findById(classId);
    if (!classroom) {
      const error = new Error('Class cannot be found');
      error.statusCode = 404;
      throw error;
    }
    classroom.students = classroom.students.filter(
      (val) => val.toString() !== studentId
    );
    await classroom.save();
    res.status(200).json({ message: 'Student Removed' });
  } catch (err) {
    next(err);
  }
};

export let removeStudentAuthor = (req, res, next) => {
  const classId = req.params.classid;
  const studentId = req.body.studentId;

  try {
    const classroom = await Classroom.findById(classId);
    if (!classroom) {
      const error = new Error('Class cannot be found');
      error.statusCode = 404;
      throw error;
    }
    if (classroom.author.toString() !== req.userId) {
      const error = new Error('Not Authorized');
      error.statusCode = 403;
      throw error;
    }
    classroom.students = classroom.students.filter(
      (val) => val.toString() !== studentId
    );
    await classroom.save();
    res.status(200).json({ message: 'Student Removed' });
  } catch (err) {
    next(err);
  }
};
