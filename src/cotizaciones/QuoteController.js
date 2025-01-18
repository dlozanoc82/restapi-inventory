import Cotizacion from './QuoteModel.js';
import DetalleCotizacion from './QuoteDetailsModel.js';
import sequelize from '../../config/dbs.js'; 
import { errorAnswer, successAnswer } from '../../helpers/answersApi.js';

/**
 * Crear una nueva cotización con sus detalles.
 */
export const createQuote = async (req, res) => {
    const { total, id_cliente, details } = req.body;

    try {
        const result = await sequelize.transaction(async (t) => {
            const quote = await Cotizacion.create(
                { total, id_cliente },
                { transaction: t }
            );

            const detailsWithQuoteId = details.map((detail) => ({
                ...detail,
                id_cotizacion: quote.id_cotizacion,
            }));

            await DetalleCotizacion.bulkCreate(detailsWithQuoteId, { transaction: t });

            return quote;
        });

        res.status(201).json({ message: 'Cotización creada con éxito', quote: result });
    } catch (error) {
        console.error('[createQuote] Error:', error);
        res.status(500).json({ error: 'Error al crear la cotización' });
    }
};

/**
 * Listar todas las cotizaciones con sus detalles.
 */
export const listQuotes = async (req, res) => {
    try {
        const quotes = await Cotizacion.findAll({
            include: {
                model: DetalleCotizacion,
                required: false,
            },
        });
        successAnswer(req, res, quotes, 200);
    } catch (error) {
        console.error('[listQuotes] Error:', error);
        errorAnswer(req, res, 'Error al obtener las cotizaciones', 500);
    }
};

/**
 * Obtener una cotización específica con sus detalles.
 */
export const getQuoteById = async (req, res) => {
    const { id } = req.params;

    try {
        const quote = await Cotizacion.findByPk(id, {
            include: {
                model: DetalleCotizacion,
                required: false,
            },
        });

        if (!quote) {
            return errorAnswer(req, res, 'Cotización no encontrada', 404);
        }
        successAnswer(req, res, quote, 200);
    } catch (error) {
        console.error('[getQuoteById] Error:', error);
        errorAnswer(req, res, 'Error al obtener la cotización', 500);
    }
};

/**
 * Eliminar una cotización y sus detalles asociados.
 */
export const deleteQuote = async (req, res) => {
    const { id } = req.params;

    try {
        await sequelize.transaction(async (t) => {
            await DetalleCotizacion.destroy({
                where: { id_cotizacion: id },
                transaction: t,
            });

            await Cotizacion.destroy({
                where: { id_cotizacion: id },
                transaction: t,
            });
        });

        successAnswer(req, res, 'Cotización eliminada correctamente', 200);
    } catch (error) {
        console.error('[deleteQuote] Error:', error);
        errorAnswer(req, res, 'Error al eliminar la cotización', 500);
    }
};

/**
 * Actualizar detalles de una cotización.
 */
export const updateQuoteDetails = async (req, res) => {
    const { id } = req.params;
    const { details } = req.body;

    try {
        await sequelize.transaction(async (t) => {
            for (const detail of details) {
                const { id_detalle, cantidad, precio_unitario, subtotal } = detail;

                if (id_detalle) {
                    await DetalleCotizacion.update(
                        { cantidad, precio_unitario, subtotal },
                        { where: { id_detalle }, transaction: t }
                    );
                } else {
                    await DetalleCotizacion.create(
                        { ...detail, id_cotizacion: id },
                        { transaction: t }
                    );
                }
            }
        });

        successAnswer(req, res, 'Detalles actualizados correctamente', 200);
    } catch (error) {
        console.error('[updateQuoteDetails] Error:', error);
        errorAnswer(req, res, 'Error al actualizar los detalles', 500);
    }
};
