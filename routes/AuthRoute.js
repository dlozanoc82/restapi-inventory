import express from 'express';
import { loginController, logoutController, refreshAccessToken } from '../src/auth/AuthController.js';

const router = express.Router();

router.post('/login', loginController);
router.post('/logout', logoutController);
router.post('/token', refreshAccessToken);

export default router;
