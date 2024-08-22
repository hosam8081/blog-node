import { fileURLToPath } from 'url';
import { dirname } from 'path';

import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connect.js';
import cors from 'cors'
// import routest
import authRouter from './routes/authRoutes.js';
import postRouter from './routes/postRoutes.js';
import usersRouter from './routes/userRoutes.js';
import commentsRouter from './routes/commentRoutes.js';


// Initialize Express application
const app = express();

app.use(cors());


// Get the directory path of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));


// Load environment variables from .env file
dotenv.config();



// Middleware to parse JSON bodies
app.use(express.json());


// Serve static files from the 'public' directory
app.use(express.static(__dirname + '/public'));

// Serve uploaded files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Define routes
app.use('/api', authRouter);
app.use('/api/post', postRouter);
app.use('/api/users', usersRouter);
app.use('/api/comments', commentsRouter);

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    const port = 8000;

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
    console.log('work');
  } catch(error) {
    console.log(error);
  }
};

start();
