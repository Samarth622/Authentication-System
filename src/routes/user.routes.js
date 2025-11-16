import express from 'express';
import { registerUser } from '../controllers/user.controllers.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

router.post('/register', upload.single("avatar"), registerUser);

export default router;