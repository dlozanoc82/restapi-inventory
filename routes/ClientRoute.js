import express from "express";
import { createOrUpdateClient, deleteClientById, exportClientsToExcel, getClientById, getClients } from "../src/clientes/ClientController.js";

//Rutas
const router = express.Router();
router.get("/", getClients);
router.get('/exportar', exportClientsToExcel); 
router.get("/:id", getClientById);
router.delete('/:id', deleteClientById)
router.post('/', createOrUpdateClient)

export default router;