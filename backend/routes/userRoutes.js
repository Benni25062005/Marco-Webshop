import express from 'express';
import { registerUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/user', registerUser);

export { router as userRouter };
