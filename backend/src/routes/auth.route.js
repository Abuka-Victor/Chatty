import { Router } from 'express';

import { verifyAuth } from '../middleware/auth.middleware.js';
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
} from '../controllers/auth.controller.js';

const authRoutes = Router();

authRoutes.post('/signup', signup);

authRoutes.post('/login', login);

authRoutes.post('/logout', verifyAuth, logout);

authRoutes.put('/update-profile', verifyAuth, updateProfile);

authRoutes.get('/check', verifyAuth, checkAuth);

export default authRoutes;
