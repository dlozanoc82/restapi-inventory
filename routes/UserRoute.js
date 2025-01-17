import express from "express";
import {
    createOrUpdateUserController,
    deleteUserController,
    getAllUsersController,
    getUserByIdController
} from "../src/usuarios/UserController.js";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware.js";


//Rutas
const router = express.Router();
router.get("/", authenticateToken, authorizeRole('admin'), getAllUsersController);
router.get("/:id", authenticateToken, authorizeRole('admin'), getUserByIdController);
router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteUserController)
router.post('/', authenticateToken, authorizeRole('admin'), createOrUpdateUserController)

export default router;