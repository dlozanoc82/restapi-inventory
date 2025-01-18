import { successAnswer } from "../../helpers/answersApi.js";
import Proveedor from "./ProveedorModel.js";

// Obtener todos los proveedores
const getSuppliers = async (req, res, next) => {
    try {
        const suppliers = await Proveedor.findAll();
        successAnswer(req, res, suppliers, 200);
    } catch (error) {
        next(error);
    }
};

// Obtener un proveedor por ID
const getSupplierById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const supplier = await Proveedor.findByPk(id);

        if (!supplier) {
            return res.status(404).json({ error: "Proveedor no encontrado" });
        }

        successAnswer(req, res, supplier, 200);
    } catch (error) {
        next(error);
    }
};

// Crear o actualizar un proveedor
const createOrUpdateSupplier = async (req, res, next) => {
    try {
        const { id_proveedor, ...supplierData } = req.body;

        if (!id_proveedor) {
            // Crear un nuevo proveedor
            const newSupplier = await Proveedor.create(supplierData);
            return successAnswer(req, res, "Proveedor creado con éxito" , 201);
        } else {
            // Actualizar un proveedor existente
            const [updatedRows] = await Proveedor.update(supplierData, {
                where: { id_proveedor },
            });

            if (updatedRows === 0) {
                return res.status(404).json({ error: "Proveedor no encontrado para actualizar" });
            }

            successAnswer(req, res, { message: "Proveedor actualizado con éxito" }, 200);
        }
    } catch (error) {
        next(error);
    }
};

// Eliminar un proveedor por ID
const deleteSupplierById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedRows = await Proveedor.destroy({
            where: { id_proveedor: id },
        });

        if (deletedRows === 0) {
            return res.status(404).json({ error: "Proveedor no encontrado para eliminar" });
        }

        successAnswer(req, res, { message: "Proveedor eliminado correctamente" }, 200);
    } catch (error) {
        next(error);
    }
};

export {
    getSuppliers,
    getSupplierById,
    createOrUpdateSupplier,
    deleteSupplierById
};
