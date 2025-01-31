import { successAnswer } from "../../helpers/answersApi.js";
import Producto from "./ProductModel.js"; // Modelo de Sequelize

// Obtiene los datos de todos los productos
const getProducts = async (req, res, next) => {
    try {
        const products = await Producto.findAll(); // Consulta todos los registros
        successAnswer(req, res, products, 200);
    } catch (error) {
        next(error);
    }
};

// Obtiene los datos de un producto por su ID
const getProductById = async (req, res, next) => {
    try {
        const product = await Producto.findByPk(req.params.id); // Busca por ID primario
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        successAnswer(req, res, product, 200);
    } catch (error) {
        next(error);
    }
};

// Elimina un producto por su ID
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

// Crea o actualiza un producto
const createOrUpdateProduct = async (req, res, next) => {
    try {
        const { id_producto, ...productData } = req.body;

        let message;
        if (!id_producto) {
            // Crear producto
            await Producto.create(productData);
            message = "Producto creado con éxito";
        } else {
            // Actualizar producto
            const [rowsUpdated] = await Producto.update(productData, {
                where: { id_producto },
            });
            if (rowsUpdated === 0) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }
            message = "Producto actualizado con éxito";
        }
        successAnswer(req, res, message, 201);
    } catch (error) {
        next(error);
    }
};

const createOrUpdateProduct2 = async (req, res, next) => {
    try {
        // Obtener los datos del body y el archivo subido (si existe)
        const { id_producto, ...productData } = req.body;

        // Si hay un archivo subido, agregar el nombre del archivo a los datos del producto
        if (req.file) {
            productData.imagen_producto = req.file.filename;
        }

        let message;
        if (!id_producto) {
            // Crear producto con imagen (si existe una)
            await Producto.create(productData);
            message = "Producto creado con éxito";
        } else {
            // Actualizar producto (con o sin imagen)
            const existingProduct = await Producto.findByPk(id_producto);

            if (!existingProduct) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }

            // Conservar la imagen existente si no se sube una nueva
            if (!req.file) {
                productData.imagen_producto = existingProduct.imagen_producto;
            }

            const [rowsUpdated] = await Producto.update(productData, {
                where: { id_producto },
            });

            message = "Producto actualizado con éxito";
        }

        // Responder con el mensaje de éxito
        successAnswer(req, res, message, 201);
    } catch (error) {
        next(error);
    }
};

export {
    deleteProductById,
    createOrUpdateProduct,
    createOrUpdateProduct2,
    getProductById,
    getProducts,
};
