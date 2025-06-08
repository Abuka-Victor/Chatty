import bcrypt from 'bcryptjs';

import { User } from '../models/users.model.js';
import { generateToken } from '../lib/generateToken.js';
import Cloudinary from '../lib/cloudinary.js';

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    generateToken(user._id, res);
    return res.status(200).json({
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const signup = async (req, res) => {
  const { fullName, password, email } = req.body;

  if (!fullName || !password || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters.' });
    }

    const oldUser = await User.findOne({ email: email });
    if (oldUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email,
      fullName,
      profilePic: '',
      password: hashedPassword,
    });

    if (!newUser) {
      return res.status(400).json({ message: 'Invalid user data' });
    }

    generateToken(newUser._id, res);
    return res.status(201).json({
      id: newUser._id,
      email: newUser.email,
      fullName: newUser.fullName,
      profilePic: newUser.profilePic,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const logout = (req, res) => {
  return res
    .clearCookie('jwt')
    .status(200)
    .json({ message: 'User logged out successfully' });
};

export const updateProfile = async (req, res) => {
  const { profilePic } = req.body;

  if (!profilePic) {
    return res.status(400).json({ message: 'Profile pic is required' });
  }
  try {
    const user = await User.findOne({ _id: req.userId }).select('-password');

    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    const uploadResolver = await Cloudinary.uploader.upload(profilePic);
    user.profilePic = uploadResolver.secure_url;
    user.save();
    return res.status(200).json({
      id: user._id,
      fullName: user.fullName,
      profilePic: user.profilePic,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    return res.status(200).json({
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
