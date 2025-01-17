import { successAnswer } from "../../helpers/answersApi.js";
import { createSupplierQuery, deleteSupplierQuery, getSupplierByIdQuery, getSuppliersQuery, updateSupplierQuery } from "./ProveedorQuery.js";

const TABLE = 'proveedores';

//Obtiene los datos de todos los clientes de la BD
const getSuppliers = async(req, res, next) => {

    try {
        const suppliers = await getSuppliersQuery(TABLE);
        successAnswer(req, res, suppliers, 200);
    } catch (error) {
        next(error);
    }
}

//Obtiene los datos de un solo cliente de la BD
const getSupplierById = async(req, res, next) => {

    try {
        const supplier = await getSupplierByIdQuery(TABLE, req.params.id);
        successAnswer(req,res, supplier, 200);
    } catch (error) {
        next(error);
    }

}

//Elimina un  cliente
const deleteSupplierById  = async(req, res, next) => {

    try {
        const supplierId = req.params.id;
        console.log(supplierId)
        const item = await deleteSupplierQuery(TABLE, supplierId);
        successAnswer(req,res, 'Proveedor eliminado correctamente', 200);
    } catch (error) {
        console.log(error);
        next(error);
    }

}

//Agrega o actualiza un cliente
const createOrUpdateSupplier = async (req, res, next) => {
    try {
        let message = '';
        const { id_proveedor , ...supplierData } = req.body;

        if (id_proveedor  === 0 || !id_proveedor ) {
            // Crear cliente si no hay ID o si es 0
            const newItem = await createSupplierQuery(TABLE, supplierData);
            message = 'Proveedor creado con éxito';
        } else {
            // Actualizar cliente si hay un ID
            const updatedItem = await updateSupplierQuery(TABLE, supplierData, id_proveedor );
            message = 'Proveedor actualizado con éxito';
        }
        successAnswer(req, res, message, 201);
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export{
    getSuppliers,
    getSupplierById,
    createOrUpdateSupplier,
    deleteSupplierById
}