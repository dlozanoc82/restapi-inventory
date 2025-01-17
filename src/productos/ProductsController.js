import { successAnswer } from "../../helpers/answersApi.js";
import { createProductQuery, deleteProductQuery, getProductByIdQuery, getProductsQuery, updateProductQuery } from "./ProductsQuery.js";

const TABLE = 'productos';

//Obtiene los datos de todos los clientes de la BD
const getProducts = async(req, res, next) => {

    try {
        const products = await getProductsQuery(TABLE);
        successAnswer(req, res, products, 200);
    } catch (error) {
        next(error);
    }
}

//Obtiene los datos de un solo cliente de la BD
const getProductById = async(req, res, next) => {

    try {
        const product = await getProductByIdQuery(TABLE, req.params.id);
        successAnswer(req,res, product, 200);
    } catch (error) {
        next(error);
    }

}

//Elimina un  cliente
const deleteProductById = async(req, res, next) => {

    try {
        const productId = req.params.id;
        console.log(productId)
        const item = await deleteProductQuery(TABLE, productId);
        successAnswer(req,res, 'Producto eliminado correctamente', 200);
    } catch (error) {
        console.log(error);
        next(error);
    }

}

//Agrega o actualiza un cliente
const createOrUpdateProduct = async (req, res, next) => {
    try {
        let message = '';
        const { id_producto, ...productData } = req.body;

        if (id_producto === 0 || !id_producto) {
            // Crear cliente si no hay ID o si es 0
            const newItem = await createProductQuery(TABLE, productData);
            message = 'Producto creado con éxito';
        } else {
            // Actualizar cliente si hay un ID
            const updatedItem = await updateProductQuery(TABLE, productData, id_producto);
            message = 'Producto actualizado con éxito';
        }
        successAnswer(req, res, message, 201);
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export{
    deleteProductById,
    createOrUpdateProduct,
    getProductById,
    getProducts
}