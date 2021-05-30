import { nanoid } from 'nanoid';

import Classroom from '../models/classroom.js';

export let createClassroom = async (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const refcode = nanoid(8);

  const classroom = new Classroom({
    title: title,
    description: description,
    teachers: [req.userId],
    author: req.userId,
    refcode: refcode,
  });
  try {
    await classroom.save();
    res.status(201).json({
      message: 'Classroom Created Successfully',
      classroom: classroom,
      author: req.userId,
    });
  } catch (err) {
    next(err);
  }
};

export let getClassrooms = async (req, res, next) => {
  try {
    const classes = await Classroom.find({
      $or: [
        { teachers: { $in: req.userId } },
        { students: { $in: req.userId } },
      ],
    });
    res
      .status(200)
      .json({ message: 'Fetched Classes Successfully', classes: classes });
  } catch (err) {
    next(err);
  }
};

export let getClassroom = async (req, res, next) => {
  const classId = req.params.classId;
  try {
    const classroom = await Classroom.findById(classId);
    if (!classroom) {
      const error = new Error('Class cannot be found');
      error.statusCode = 404;
      throw error;
    }
    if (
      classroom.author.toString() !== req.userId ||
      classroom.teachers.includes(userId) ||
      classroom.students.includes(userId)
    ) {
      const error = new Error('Unauthorized');
      error.statusCode = 403;
      throw error;
    }
    res.status(200).json({ message: 'Class Fetched', classroom: classroom });
  } catch (err) {
    next(err);
  }
};

export let updateClassroom = async (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const classId = req.params.classId;

  try {
    const classroom = await Classroom.findById(classId);
    if (!classroom) {
      const error = new Error('Class cannot be found');
      error.statusCode = 404;
      throw error;
    }
    if (
      classroom.author.toString() !== req.userId ||
      classroom.teachers.includes(userId) ||
      classroom.students.includes(userId)
    ) {
      const error = new Error('Unauthorized');
      error.statusCode = 403;
      throw error;
    }
    if (!title) {
      title = classroom.title;
    }
    if (!description) {
      description = classroom.description;
    }
    const result = await Classroom.save();
    res.status(200).json({ message: 'Post Updated', classroom: result });
  } catch (err) {
    next(err);
  }
};

export let deleteClassroom = async (req, res, next) => {
  const classId = req.params.classId;

  try {
    const classroom = await Classroom.findById(classId);
    if (!classroom) {
      const error = new Error('Class cannot be found');
      error.statusCode = 404;
      throw error;
    }
    if (
      classroom.author.toString() !== req.userId ||
      classroom.teachers.includes(userId) ||
      classroom.students.includes(userId)
    ) {
      const error = new Error('Unauthorized');
      error.statusCode = 403;
      throw error;
    }
    await Classroom.findByIdAndRemove(classId);
    res.status(200).json({ message: 'Classroom Successfully Deleted' });
  } catch (err) {
    next(err);
  }
};
