import express from "express";
import { createOrUpdateProduct, deleteProductById, getProductById, getProducts,getProductsBySubcategoryId } from "../src/productos/ProductsController.js";
import { uploadSingle } from "../config/multerConfig.js";

//Rutas
const router = express.Router();
router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/subcategoria/:id", getProductsBySubcategoryId)
router.delete('/:id', deleteProductById)
router.post('/', uploadSingle, createOrUpdateProduct)

export default router;