import { successAnswer } from "../../helpers/answersApi.js";
import { 
    createCategoryQuery, 
    deleteCategoryQuery, 
    getCategoryByIdQuery, 
    getCategoriesQuery, 
    updateCategoryQuery,
    createSubcategoryQuery,
    deleteSubcategoryQuery,
    getSubcategoryByIdQuery,
    getSubcategoriesQuery,
    updateSubcategoryQuery
} from "./CategoriesQuery.js";

const CATEGORY_TABLE = 'categorias';
const SUBCATEGORY_TABLE = 'subcategorias';

// Controlador para Categorías

const getCategories = async(req, res, next) => {
    try {
        const categories = await getCategoriesQuery(CATEGORY_TABLE);
        successAnswer(req, res, categories, 200);
    } catch (error) {
        next(error);
    }
}

const getCategoryById = async(req, res, next) => {
    try {
        const category = await getCategoryByIdQuery(CATEGORY_TABLE, req.params.id);
        successAnswer(req, res, category, 200);
    } catch (error) {
        next(error);
    }
}

const deleteCategoryById = async(req, res, next) => {
    try {
        const categoryId = req.params.id;
        await deleteCategoryQuery(CATEGORY_TABLE, categoryId);
        successAnswer(req, res, 'Categoría eliminada correctamente', 200);
    } catch (error) {
        next(error);
    }
}

const createOrUpdateCategory = async(req, res, next) => {
    try {
        let message = '';
        const { id_categoria, ...categoryData } = req.body;

        if (id_categoria === 0 || !id_categoria) {
            await createCategoryQuery(CATEGORY_TABLE, categoryData);
            message = 'Categoría creada con éxito';
        } else {
            await updateCategoryQuery(CATEGORY_TABLE, categoryData, id_categoria);
            message = 'Categoría actualizada con éxito';
        }
        successAnswer(req, res, message, 201);
    } catch (error) {
        next(error);
    }
}

// Controlador para Subcategorías

const getSubcategories = async(req, res, next) => {
    try {
        const subcategories = await getSubcategoriesQuery(SUBCATEGORY_TABLE);
        successAnswer(req, res, subcategories, 200);
    } catch (error) {
        next(error);
    }
}

const getSubcategoryById = async(req, res, next) => {
    try {
        const subcategory = await getSubcategoryByIdQuery(SUBCATEGORY_TABLE, req.params.id);
        successAnswer(req, res, subcategory, 200);
    } catch (error) {
        next(error);
    }
}

const deleteSubcategoryById = async(req, res, next) => {
    try {
        const subcategoryId = req.params.id;
        await deleteSubcategoryQuery(SUBCATEGORY_TABLE, subcategoryId);
        successAnswer(req, res, 'Subcategoría eliminada correctamente', 200);
    } catch (error) {
        next(error);
    }
}

const createOrUpdateSubcategory = async(req, res, next) => {
    try {
        let message = '';
        const { id_subcategoria, ...subcategoryData } = req.body;

        if (id_subcategoria === 0 || !id_subcategoria) {
            await createSubcategoryQuery(SUBCATEGORY_TABLE, subcategoryData);
            message = 'Subcategoría creada con éxito';
        } else {
            await updateSubcategoryQuery(SUBCATEGORY_TABLE, subcategoryData, id_subcategoria);
            message = 'Subcategoría actualizada con éxito';
        }
        successAnswer(req, res, message, 201);
    } catch (error) {
        next(error);
    }
}

export {
    getCategories,
    getCategoryById,
    deleteCategoryById,
    createOrUpdateCategory,
    getSubcategories,
    getSubcategoryById,
    deleteSubcategoryById,
    createOrUpdateSubcategory
}
