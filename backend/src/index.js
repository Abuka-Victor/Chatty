import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { app, server } from './lib/socket.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectdb } from './lib/db.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

config();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectdb();
});
