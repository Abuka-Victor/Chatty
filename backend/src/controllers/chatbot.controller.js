import { ChatBot } from '../models/chatbot.model.js';
import Cloudinary from '../lib/cloudinary.js';
import { getUserSocketId, io } from '../lib/socket.js';
import { generateChatBotResponseV2 } from '../lib/ai.js';

export const getChatBotMessages = async (req, res) => {
  const senderId = req.userId;
  try {
    const messages = await ChatBot.find({
      senderId,
    });
    return res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const sendChatBotMessage = async (req, res) => {
  const { text, image } = req.body;
  const senderId = req.userId;
  try {
    let imageUrl;

    if (image) {
      const uploadResolver = await Cloudinary.uploader.upload(image);
      imageUrl = uploadResolver.secure_url;
    }

    const newMessage = await ChatBot.create({
      senderId,
      image: imageUrl,
      text,
      type: 'sent',
    });

    const response = await generateChatBotResponseV2(newMessage);

    const dbResponse = await ChatBot.create({
      senderId,
      image: response.image,
      text: response.text,
      type: 'received',
    });

    const senderSockId = getUserSocketId(senderId);
    if (senderSockId) {
      io.to(senderSockId).emit('newMessage', response);
    }

    return res.status(200).json([newMessage, dbResponse]);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
