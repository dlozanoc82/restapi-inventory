import express from 'express';
import { loginController, logoutController, refreshAccessToken } from '../controllers/AuthController.js';

const router = express.Router();

router.post('/login', loginController);
router.post('/logout', logoutController);
router.post('/token', refreshAccessToken);  // Ruta para renovar el access token usando el refresh token

export default router;
