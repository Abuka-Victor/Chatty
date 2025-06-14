import mongoose from 'mongoose';

const ChatBotSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true, ref: 'User' },
    text: { type: String },
    image: { type: String },
    type: { type: String, enum: ['sent', 'received'] },
  },
  { timestamps: true }
);

export const ChatBot = mongoose.model('ChatBot', ChatBotSchema);
