import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

export let signup = async (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  try {
    const checkMail = await User.findOne({ email: email });
    if (checkMail) {
      const error = new Error('Account Already Exists.');
      error.statusCode = 404;
      throw error;
    }
    const hashedPw = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      name,
      password: hashedPw,
    });
    const result = await user.save();
    res.status(201).json({ message: 'User Created!', userId: result._id });
  } catch (err) {
    next(err);
  }
};

export let login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('Account Not Found.');
      error.statusCode = 404;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      'supersecretkey',
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token, userId: user._id.toString() });
  } catch (err) {
    next(err);
  }
};
