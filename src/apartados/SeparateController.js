import Apartado from './SeparateModel.js';
import DetalleApartado from './SeparateDetailsModel.js';
import AbonoApartado from './SeparatePaymentsModel.js';
import sequelize from '../../config/dbs.js'; 
import { errorAnswer, successAnswer } from '../../helpers/answersApi.js';

/**
 * Crear un nuevo apartado con sus detalles.
 */
const createApartado = async (req, res) => {
    const { total, id_cliente, id_usuario, details } = req.body;

    try {
        const result = await sequelize.transaction(async (t) => {
            const apartado = await Apartado.create(
                { total, id_cliente, id_usuario },
                { transaction: t }
            );

            const detailsWithApartadoId = details.map((detail) => ({
                ...detail,
                id_apartado: apartado.id_apartado,
            }));

            await DetalleApartado.bulkCreate(detailsWithApartadoId, { transaction: t });

            return apartado;
        });

        res.status(201).json({ message: 'Apartado creado con éxito', apartado: result });
    } catch (error) {
        console.error('[createApartado] Error:', error);
        res.status(500).json({ error: 'Error al crear el apartado' });
    }
};

/**
 * Listar todos los apartados con sus detalles.
 */
const getApartados = async (req, res) => {
    try {
        const apartados = await Apartado.findAll({
            include: [
                {
                    model: DetalleApartado,
                    required: false,
                },
                {
                    model: AbonoApartado,
                    required: false
                }
            ],
        });
        successAnswer(req, res, apartados, 200);
    } catch (error) {
        console.error('[listApartados] Error:', error);
        errorAnswer(req, res, 'Error al obtener los apartados', 500);
    }
};

/**
 * Obtener un apartado específico con sus detalles.
 */
const getApartadoById = async (req, res) => {
    const { id } = req.params;

    try {
        const apartado = await Apartado.findByPk(id, {
            include: [
                {
                    model: DetalleApartado,
                    required: false,
                },
                {
                    model: AbonoApartado,
                    required: false
                }
            ],
        });

        if (!apartado) {
            return errorAnswer(req, res, 'Apartado no encontrado', 404);
        }
        successAnswer(req, res, apartado, 200);
    } catch (error) {
        console.error('[getApartadoById] Error:', error);
        errorAnswer(req, res, 'Error al obtener el apartado', 500);
    }
};

/**
 * Eliminar un apartado y sus detalles asociados.
 */
const deleteApartado = async (req, res) => {
    const { id } = req.params;

    try {
        await sequelize.transaction(async (t) => {
            await DetalleApartado.destroy({
                where: { id_apartado: id },
                transaction: t,
            });

            await Apartado.destroy({
                where: { id_apartado: id },
                transaction: t,
            });
        });

        successAnswer(req, res, 'Apartado eliminado correctamente', 200);
    } catch (error) {
        console.error('[deleteApartado] Error:', error);
        errorAnswer(req, res, 'Error al eliminar el apartado', 500);
    }
};

/**
 * Actualizar detalles de un apartado.
 */
const updateApartadoDetails = async (req, res) => {
    const { id } = req.params;
    const { details } = req.body;

    try {
        await sequelize.transaction(async (t) => {
            for (const detail of details) {
                const { id_detalle, cantidad, precio_unitario, subtotal } = detail;

                if (id_detalle) {
                    await DetalleApartado.update(
                        { cantidad, precio_unitario, subtotal },
                        { where: { id_detalle }, transaction: t }
                    );
                } else {
                    await DetalleApartado.create(
                        { ...detail, id_apartado: id },
                        { transaction: t }
                    );
                }
            }
        });

        successAnswer(req, res, 'Detalles actualizados correctamente', 200);
    } catch (error) {
        console.error('[updateApartadoDetails] Error:', error);
        errorAnswer(req, res, 'Error al actualizar los detalles', 500);
    }
};

/**
 * Crear un nuevo abono para un apartado existente.
 */
const createAbono = async (req, res) => {
    const { id_apartado, monto_abono, id_mdspago } = req.body;

    try {
        const abono = await AbonoApartado.create({
            id_apartado, monto_abono, id_mdspago,
        });

        res.status(201).json({ message: 'Abono creado con éxito', abono });
    } catch (error) {
        console.error('[createAbono] Error:', error);
        errorAnswer(req, res, 'Error al crear el abono', 500);
    }
};

/**
 * Actualizar un abono existente.
 */
const updateAbono = async (req, res) => {
    const { id_abono } = req.params;
    const { monto_abono, id_mdspago } = req.body;

    try {
        const abono = await AbonoApartado.update(
            { monto_abono, id_mdspago },
            { where: { id_abono } }
        );

        if (abono[0] === 0) {
            return errorAnswer(req, res, 'Abono no encontrado', 404);
        }

        successAnswer(req, res, 'Abono actualizado correctamente', 200);
    } catch (error) {
        console.error('[updateAbono] Error:', error);
        errorAnswer(req, res, 'Error al actualizar el abono', 500);
    }
};

export{
    createApartado,
    getApartados,
    getApartadoById,
    deleteApartado,
    updateApartadoDetails,
    createAbono,
    updateAbono
}