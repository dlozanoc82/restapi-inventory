import express from "express";
import { getAdquisiciones, getAdquisicionById, deleteAdquisicionById, createOrUpdateAdquisicion } from "../src/adquisiciones/ComprasController.js";

//Rutas
const router = express.Router();
router.get("/", getAdquisiciones);
router.get("/:id", getAdquisicionById);
router.delete('/:id', deleteAdquisicionById)
router.post('/', createOrUpdateAdquisicion)

export default router;