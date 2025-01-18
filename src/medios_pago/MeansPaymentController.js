import { successAnswer } from "../../helpers/answersApi.js";
import MedioDePago from "./MeansPaymentModel.js";

// Obtener todos los proveedores
const getMeansPayments = async (req, res, next) => {
    try {
        const meansPayments = await MedioDePago.findAll();
        successAnswer(req, res, meansPayments, 200);
    } catch (error) {
        next(error);
    }
};

// Obtener un proveedor por ID
const getMeansPaymentsById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const meanPayment = await MedioDePago.findByPk(id);

        if (!meanPayment) {
            return res.status(404).json({ error: "Medio de pago no encontrado" });
        }

        successAnswer(req, res, meanPayment, 200);
    } catch (error) {
        next(error);
    }
};

// Crear o actualizar un proveedor
const createOrUpdateMeansPayments = async (req, res, next) => {
    try {
        const { id_mdspago, ...meansPaymentsData } = req.body;

        if (!id_mdspago) {
            // Crear un nuevo proveedor
            const newSupplier = await MedioDePago.create(meansPaymentsData);
            return successAnswer(req, res, "MedioDePago creado con éxito" , 201);
        } else {
            // Actualizar un proveedor existente
            const [updatedRows] = await MedioDePago.update(meansPaymentsData, {
                where: { id_mdspago },
            });

            if (updatedRows === 0) {
                return res.status(404).json({ error: "MedioDePago no encontrado para actualizar" });
            }

            successAnswer(req, res, { message: "MedioDePago actualizado con éxito" }, 200);
        }
    } catch (error) {
        next(error);
    }
};

// Eliminar un proveedor por ID
const deleteMeansPaymentsById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedRows = await MedioDePago.destroy({
            where: { id_mdspago: id },
        });

        if (deletedRows === 0) {
            return res.status(404).json({ error: "MedioDePago no encontrado para eliminar" });
        }

        successAnswer(req, res, { message: "MedioDePago eliminado correctamente" }, 200);
    } catch (error) {
        next(error);
    }
};

export {
    getMeansPayments,
    getMeansPaymentsById,
    createOrUpdateMeansPayments,
    deleteMeansPaymentsById
};
