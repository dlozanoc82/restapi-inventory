import express from "express";
import { createOrUpdateSupplier, deleteSupplierById, getSupplierById, getSuppliers } from "../src/proveedores/ProveedorController.js";

//Rutas
const router = express.Router();
router.get("/", getSuppliers);
router.get("/:id", getSupplierById);
router.delete('/:id', deleteSupplierById)
router.post('/', createOrUpdateSupplier)

export default router;