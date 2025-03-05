// comprasController.js
import { successAnswer } from "../../helpers/answersApi.js";
import Adquisicion from "./ComprasModel.js";
import Producto from "../productos/ProductModel.js";
import Proveedor from "../proveedores/ProveedorModel.js";

// Obtener todas las adquisiciones con sus productos y proveedores
const getAdquisiciones = async (req, res, next) => {
    try {
        const adquisiciones = await Adquisicion.findAll({
            include: [
                {
                    model: Producto,
                    as: 'producto',
                    attributes: ['id_producto', 'nombre_producto', 'precio_producto']
                },
                {
                    model: Proveedor,
                    as: 'proveedor',
                    attributes: ['id_proveedor', 'nombre_proveedor']
                }
            ],
            order: [['id_adquisicion', 'DESC']]
        });

        successAnswer(req, res, adquisiciones, 200);
    } catch (error) {
        next(error);
    }
};

// Obtener una adquisición por ID
const getAdquisicionById = async (req, res, next) => {
    try {
        const adquisicion = await Adquisicion.findByPk(req.params.id, {
            include: [
                {
                    model: Producto,
                    as: 'producto',
                    attributes: ['id_producto', 'nombre_producto', 'precio_producto']
                },
                {
                    model: Proveedor,
                    as: 'proveedor',
                    attributes: ['id_proveedor', 'nombre_proveedor']
                }
            ]
        });

        if (!adquisicion) {
            return res.status(404).json({ message: "Adquisición no encontrada" });
        }

        successAnswer(req, res, adquisicion, 200);
    } catch (error) {
        next(error);
    }
};

// Eliminar una adquisición por ID
const deleteAdquisicionById = async (req, res, next) => {
    try {
        const rowsDeleted = await Adquisicion.destroy({ where: { id_adquisicion: req.params.id } });

        if (rowsDeleted === 0) {
            return res.status(404).json({ message: "Adquisición no encontrada" });
        }

        successAnswer(req, res, "Adquisición eliminada correctamente", 200);
    } catch (error) {
        next(error);
    }
};

// Crear o actualizar una adquisición
const createOrUpdateAdquisicion = async (req, res, next) => {
    try {
        const { id_adquisicion, ...adquisicionData } = req.body;

        let message;
        if (!id_adquisicion) {
            await Adquisicion.create(adquisicionData);
            message = "Adquisición creada con éxito";
        } else {
            const existingAdquisicion = await Adquisicion.findByPk(id_adquisicion);
            if (!existingAdquisicion) {
                return res.status(404).json({ message: "Adquisición no encontrada" });
            }

            await Adquisicion.update(adquisicionData, { where: { id_adquisicion } });
            message = "Adquisición actualizada con éxito";
        }

        successAnswer(req, res, message, 201);
    } catch (error) {
        next(error);
    }
};

export {
    deleteAdquisicionById,
    createOrUpdateAdquisicion,
    getAdquisicionById,
    getAdquisiciones,
};
