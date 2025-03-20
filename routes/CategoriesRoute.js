import express from "express";
import {
    getCategories,
    getCategoryById,
    deleteCategoryById,
    createOrUpdateCategory,
} from "../src/categorias/CategoriesController.js"; // Asegúrate de que la ruta del archivo sea correcta
import { 
    createOrUpdateSubcategory,
    deleteSubcategoryById,
    getSubcategories,
    getSubcategoriesByCategoryId,
    getSubcategoryById,
    exportSubcategoriesToExcel,
    exportSubcategoriesToPDF
} from "../src/subcategorias/SubcategoriesController.js";

const router = express.Router();

// Routes for Categories
router.get("/categorias", getCategories); // Cambié getCategoriesAndSubcategories por getCategories
router.get("/categorias/:id", getCategoryById);
router.delete("/categorias/:id", deleteCategoryById);
router.post("/categorias", createOrUpdateCategory);

// Routes for Subcategories
router.get("/subcategorias", getSubcategories); // Cambié la ruta para obtener todas las subcategorías
router.get("/subcategorias/pdf", exportSubcategoriesToPDF);
router.get("/subcategorias/excel", exportSubcategoriesToExcel);
router.get("/subcategorias/:id", getSubcategoryById);
router.get("/subcategorias/categoria/:id", getSubcategoriesByCategoryId);
router.delete("/subcategorias/:id", deleteSubcategoryById);
router.post("/subcategorias", createOrUpdateSubcategory);

export default router;
