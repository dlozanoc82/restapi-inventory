// ProductController.js
import { successAnswer } from "../../helpers/answersApi.js";
import Producto from "./ProductModel.js";
import Subcategoria from "../subcategorias/SubCategoriesModel.js";
import Categoria from "../categorias/CategoriaModel.js";

// Obtener todos los productos con sus categorías y subcategorías
const getProducts = async (req, res, next) => {
    try {
        const products = await Producto.findAll({
            include: [
                {
                    model: Subcategoria,
                    as: 'subcategoria', // IMPORTANTE: Usa el alias definido en el modelo
                    attributes: ['id_subcategoria','nombre_subcategoria'],
                    include: {
                        model: Categoria,
                        as: 'categoria', // IMPORTANTE: Usa el alias definido en el modelo
                        attributes: ['id_categoria', 'nombre_categoria']
                    }
                }
            ],
            order: [['id_producto', 'DESC']],
        });

        // Convertir instancias a JSON para poder acceder a los datos correctamente
        const formattedProducts = products.map(product => {
            const productJSON = product.toJSON(); // 💡 Convierte la instancia en un objeto JSON

            return {
                id_producto: productJSON.id_producto,
                nombre_producto: productJSON.nombre_producto,
                descripcion_producto: productJSON.descripcion_producto,
                imagen_producto: productJSON.imagen_producto,
                precio_producto: productJSON.precio_producto,
                stock: productJSON.stock,
                garantia: productJSON.garantia,
                duracion_garantia: productJSON.duracion_garantia,
                fecha_creacion: productJSON.fecha_creacion,
                estado: productJSON.estado,
                id_categoria: productJSON.subcategoria?.categoria?.id_categoria || null,
                id_subcategoria: productJSON.subcategoria?.id_subcategoria || null,
                categoria: productJSON.subcategoria?.categoria?.nombre_categoria || "Sin categoría",
                subcategoria: productJSON.subcategoria?.nombre_subcategoria || "Sin subcategoría"
            };
        });

        successAnswer(req, res, formattedProducts, 200);
    } catch (error) {
        next(error);
    }
};

// Obtener producto por ID
const getProductById = async (req, res, next) => {
    try {
        const product = await Producto.findByPk(req.params.id, {
            include: [
                {
                    model: Subcategoria,
                    as: 'subcategoria', // Usa el alias correcto
                    attributes: ['id_subcategoria', 'nombre_subcategoria'],
                    include: {
                        model: Categoria,
                        as: 'categoria', // Usa el alias correcto
                        attributes: ['id_categoria', 'nombre_categoria']
                    }
                }
            ]
        });

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const productJSON = product.toJSON(); // 💡 Convierte la instancia en un objeto JSON para evitar problemas

        const formattedProduct = {
            id_producto: productJSON.id_producto,
            nombre_producto: productJSON.nombre_producto,
            descripcion_producto: productJSON.descripcion_producto,
            imagen_producto: productJSON.imagen_producto,
            precio_producto: productJSON.precio_producto,
            stock: productJSON.stock,
            garantia: productJSON.garantia,
            duracion_garantia: productJSON.duracion_garantia,
            fecha_creacion: productJSON.fecha_creacion,
            estado: productJSON.estado,
            id_categoria: productJSON.subcategoria?.categoria?.id_categoria || null,
            id_subcategoria: productJSON.subcategoria?.id_subcategoria || null,
            categoria: productJSON.subcategoria?.categoria?.nombre_categoria || "Sin categoría",
            subcategoria: productJSON.subcategoria?.nombre_subcategoria || "Sin subcategoría"
        };

        successAnswer(req, res, formattedProduct, 200);
    } catch (error) {
        next(error);
    }
};

// Obtener producto por ID Subcategoria
const getProductsBySubcategoryId = async (req, res, next) => {
    try {
        const idSubcategoria = req.params.id;

        const products = await Producto.findAll({
            where: { id_subcategoria: idSubcategoria }, // Filtrar por subcategoría
            include: [
                {
                    model: Subcategoria,
                    as: 'subcategoria',
                    attributes: ['id_subcategoria', 'nombre_subcategoria'],
                    include: {
                        model: Categoria,
                        as: 'categoria',
                        attributes: ['id_categoria', 'nombre_categoria']
                    }
                }
            ],
            order: [['id_producto', 'DESC']],
        });

        if (products.length === 0) {
            return res.status(404).json({ message: "No hay productos en esta subcategoría" });
        }

        // Formatear los datos antes de enviarlos
        const formattedProducts = products.map(product => {
            const productJSON = product.toJSON();
            return {
                id_producto: productJSON.id_producto,
                nombre_producto: productJSON.nombre_producto,
                descripcion_producto: productJSON.descripcion_producto,
                imagen_producto: productJSON.imagen_producto,
                precio_producto: productJSON.precio_producto,
                stock: productJSON.stock,
                garantia: productJSON.garantia,
                duracion_garantia: productJSON.duracion_garantia,
                fecha_creacion: productJSON.fecha_creacion,
                estado: productJSON.estado,
                id_categoria: productJSON.subcategoria?.categoria?.id_categoria || null,
                id_subcategoria: productJSON.subcategoria?.id_subcategoria || null,
                categoria: productJSON.subcategoria?.categoria?.nombre_categoria || "Sin categoría",
                subcategoria: productJSON.subcategoria?.nombre_subcategoria || "Sin subcategoría"
            };
        });

        successAnswer(req, res, formattedProducts, 200);
    } catch (error) {
        next(error);
    }
};

// Eliminar producto por ID
const deleteProductById = async (req, res, next) => {
    try {
        const rowsDeleted = await Producto.destroy({ where: { id_producto: req.params.id } });

        if (rowsDeleted === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        successAnswer(req, res, "Producto eliminado correctamente", 200);
    } catch (error) {
        next(error);
    }
};

// Crear o actualizar producto
const createOrUpdateProduct = async (req, res, next) => {
    try {
        const { id_producto, ...productData } = req.body;

        if (req.file) {
            productData.imagen_producto = req.file.filename;
        }

        let message;
        if (!id_producto) {
            await Producto.create(productData);
            message = "Producto creado con éxito";
        } else {
            const existingProduct = await Producto.findByPk(id_producto);
            if (!existingProduct) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }

            if (!req.file) {
                productData.imagen_producto = existingProduct.imagen_producto;
            }

            await Producto.update(productData, { where: { id_producto } });
            message = "Producto actualizado con éxito";
        }

        successAnswer(req, res, message, 201);
    } catch (error) {
        next(error);
    }
};

export {
    deleteProductById,
    createOrUpdateProduct,
    getProductById,
    getProducts,
    getProductsBySubcategoryId,
};
