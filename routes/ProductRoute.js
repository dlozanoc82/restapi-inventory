import express from "express";
import { createOrUpdateProduct, deleteProductById, getProductById, getProducts } from "../src/productos/ProductsController.js";
import { uploadSingle } from "../config/multerConfig.js";

//Rutas
const router = express.Router();
router.get("/", getProducts);
router.get("/:id", getProductById);
router.delete('/:id', deleteProductById)
router.post('/', uploadSingle, createOrUpdateProduct)

export default router;