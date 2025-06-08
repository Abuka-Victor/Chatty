import { Message } from '../models/message.model.js';
import { User } from '../models/users.model.js';
import Cloudinary from '../lib/cloudinary.js';
import { getUserSocketId, io } from '../lib/socket.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }).select(
      '-password'
    );
    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getMessages = async (req, res) => {
  const { id: receiverId } = req.params;
  const senderId = req.userId;
  try {
    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    return res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const sendMessage = async (req, res) => {
  const { text, image } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.userId;
  try {
    let imageUrl;

    if (image) {
      const uploadResolver = await Cloudinary.uploader.upload(image);
      imageUrl = uploadResolver.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      image: imageUrl,
      text,
    });

    const rSockId = getUserSocketId(receiverId);
    if (rSockId) {
      io.to(rSockId).emit('newMessage', newMessage);
    }

    return res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
