import { successAnswer } from "../../helpers/answersApi.js";
import Categoria from "./CategoriaModel.js";

// Controlador para Categorías

const getCategories = async (req, res, next) => {
    try {
        const categories = await Categoria.findAll();
        successAnswer(req, res, categories, 200);
    } catch (error) {
        next(error);
    }
}

const getCategoryById = async (req, res, next) => {
    try {
        const category = await Categoria.findByPk(req.params.id);
        successAnswer(req, res, category, 200);
    } catch (error) {
        next(error);
    }
}

const deleteCategoryById = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        await Categoria.destroy({ where: { id_categoria: categoryId } });
        successAnswer(req, res, 'Categoría eliminada correctamente', 200);
    } catch (error) {
        next(error);
    }
}

const createOrUpdateCategory = async (req, res, next) => {
    try {
        let message = '';
        const { id_categoria, ...categoryData } = req.body;

        if (!id_categoria || id_categoria === 0) {
            await Categoria.create(categoryData);
            message = 'Categoría creada con éxito';
        } else {
            await Categoria.update(categoryData, { where: { id_categoria } });
            message = 'Categoría actualizada con éxito';
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
};
