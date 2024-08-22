import express from 'express';
import { postComment } from '../controllers/commentsController.js';

const router = express.Router();

router.post('/create', postComment);

export default router;