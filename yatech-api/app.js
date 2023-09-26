import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import userRoute from './routes/userRoute.js';
import authRoute from './routes/authRoute.js';

// Config
dotenv.config();
export const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());

// // Routes
app.use('/api', userRoute);
app.use('/api', authRoute);
app.all('*', (req, res) => {
  res.status(404).json({ message: 'Route Not found' });
});

// Server
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
