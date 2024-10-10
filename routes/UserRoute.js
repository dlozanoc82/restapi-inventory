import express from "express";
import {
    createOrUpdateUserController,
    deleteUserController,
    getAllUsersController,
    getUserByIdController
} from "../controllers/UserController.js";


//Rutas
const router = express.Router();
router.get("/", getAllUsersController);
router.get("/:id", getUserByIdController);
router.put('/', deleteUserController)
router.post('/', createOrUpdateUserController)

export default router;