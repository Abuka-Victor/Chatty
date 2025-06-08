import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    receiverId: { type: String, required: true, ref: 'User' },
    senderId: { type: String, required: true, ref: 'User' },
    text: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

export const Message = mongoose.model('Message', MessageSchema);
