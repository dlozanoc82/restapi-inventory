import { successAnswer } from "../../helpers/answersApi.js";
import Categoria from "../categorias/CategoriaModel.js";
import Subcategoria from "./SubCategoriesModel.js";

// Controlador para Subcategorías
const getSubcategories = async (req, res, next) => {
    try {
        const subcategories = await Subcategoria.findAll({
            include: [
                {
                    model: Categoria,
                    as: 'categoria',
                    attributes: ['nombre_categoria'], 
                },
            ]
        });

        // Transformar la respuesta para extraer nombre_categoria
        const formattedSubcategories = subcategories.map(subcat => {
            const { categoria, ...subcatData } = subcat.get({ plain: true });  
            return { 
                ...subcatData, 
                nombre_categoria: categoria ? categoria.nombre_categoria : null 
            };
        });

        successAnswer(req, res, formattedSubcategories, 200);
    } catch (error) {
        next(error);
    }
};


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