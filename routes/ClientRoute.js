import express from "express";
import {
    deleteClientById,
    createOrUpdateClient,
    getClientById,
    getClients }
from "../controllers/ClientController.js";


//Rutas
const router = express.Router();
router.get("/", getClients);
router.get("/:id", getClientById);
router.put('/', deleteClientById)
router.post('/', createOrUpdateClient)

export default router;