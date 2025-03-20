import express from "express";
import { createOrUpdateSupplier, deleteSupplierById, getSupplierById, getSuppliers, exportSuppliersToExcel,exportSuppliersToPDF } from "../src/proveedores/ProveedorController.js";

//Rutas
const router = express.Router();
router.get("/", getSuppliers);
router.get("/excel", exportSuppliersToExcel);
router.get("/pdf", exportSuppliersToPDF);
router.get("/:id", getSupplierById);
router.delete('/:id', deleteSupplierById)
router.post('/', createOrUpdateSupplier)

export default router;