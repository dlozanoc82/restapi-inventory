import express from "express";
import { createOrUpdateClient, deleteClientById, exportClientsToExcel, exportClientsToPDF, getClientById, getClients } from "../src/clientes/ClientController.js";

//Rutas
const router = express.Router();
router.get("/", getClients);
router.get('/excel', exportClientsToExcel);
router.get('/pdf', exportClientsToPDF);
router.get("/:id", getClientById);
router.delete('/:id', deleteClientById)
router.post('/', createOrUpdateClient)

export default router;