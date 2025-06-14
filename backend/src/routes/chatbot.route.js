import { Router } from 'express';

import { verifyAuth } from '../middleware/auth.middleware.js';
import {
  getChatBotMessages,
  sendChatBotMessage,
} from '../controllers/chatbot.controller.js';

const chatBotRoutes = Router();

chatBotRoutes.post('/', verifyAuth, sendChatBotMessage);
chatBotRoutes.get('/', verifyAuth, getChatBotMessages);

export default chatBotRoutes;
