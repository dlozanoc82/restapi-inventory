import { successAnswer } from "../../helpers/answersApi.js";
import Subcategoria from "./SubCategoriesModel.js";

// Controlador para Subcategorías
const getSubcategories = async (req, res, next) => {
    try {
        const subcategories = await Subcategoria.findAll();
        successAnswer(req, res, subcategories, 200);
    } catch (error) {
        next(error);
    }
}

const getSubcategoryById = async (req, res, next) => {
    try {
        const subcategory = await Subcategoria.findByPk(req.params.id);
        successAnswer(req, res, subcategory, 200);
    } catch (error) {
        next(error);
    }
}

const getSubcategoriesByCategoryId = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const subcategories = await Subcategoria.findAll({ where: { id_categoria: categoryId } });

        successAnswer(req, res, subcategories, 200);
    } catch (error) {
        next(error);
    }
}


const deleteSubcategoryById = async (req, res, next) => {
    try {
        const subcategoryId = req.params.id;
        await Subcategoria.destroy({ where: { id_subcategoria: subcategoryId } });
        successAnswer(req, res, 'Subcategoría eliminada correctamente', 200);
    } catch (error) {
        next(error);
    }
}

const createOrUpdateSubcategory = async (req, res, next) => {
    try {
        let message = '';
        const { id_subcategoria, ...subcategoryData } = req.body;

        if (!id_subcategoria || id_subcategoria === 0) {
            await Subcategoria.create(subcategoryData);
            message = 'Subcategoría creada con éxito';
        } else {
            await Subcategoria.update(subcategoryData, { where: { id_subcategoria } });
            message = 'Subcategoría actualizada con éxito';
        }
        successAnswer(req, res, message, 201);
    } catch (error) {
        next(error);
    }
}

export {
    getSubcategories,
    getSubcategoryById,
    getSubcategoriesByCategoryId,
    deleteSubcategoryById,
    createOrUpdateSubcategory
}