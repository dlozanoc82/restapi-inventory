import express from "express";
import {
    createOrUpdateUserController,
    deleteUserController,
    getAllUsersController,
    getUserByIdController
} from "../controllers/UserController.js";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware.js";


//Rutas
const router = express.Router();
router.get("/", authenticateToken, authorizeRole('admin'), getAllUsersController);
router.get("/:id", authenticateToken, authorizeRole('admin'), getUserByIdController);
router.put('/', authenticateToken, authorizeRole('admin'), deleteUserController)
router.post('/', authenticateToken, authorizeRole('admin'), createOrUpdateUserController)

export default router;