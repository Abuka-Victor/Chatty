import { Router } from 'express';

import { verifyAuth } from '../middleware/auth.middleware.js';
import {
  getMessages,
  getUsers,
  sendMessage,
} from '../controllers/message.controller.js';

const messageRoutes = Router();

messageRoutes.get('/users', verifyAuth, getUsers);
messageRoutes.post('/users/:id', verifyAuth, sendMessage);
messageRoutes.get('/:id', verifyAuth, getMessages);

export default messageRoutes;
