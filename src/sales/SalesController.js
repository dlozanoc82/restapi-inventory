import Sale from './Sales.js';
import SaleDetail from './SalesDetail.js'
import sequelize from '../../config/dbs.js'; 
import { errorAnswer, successAnswer } from '../../helpers/answersApi.js';

/**
 * Crear una nueva venta con sus detalles.
 */
export const createSale = async (req, res) => {
    const { total, id_cliente, id_mdspago, id_vendedor, details } = req.body;

    try {
        const result = await sequelize.transaction(async (t) => {
            const sale = await Sale.create(
                { total, id_cliente, id_mdspago, id_vendedor },
                { transaction: t }
            );

            const detailsWithSaleId = details.map((detail) => ({
                ...detail,
                id_venta: sale.id_venta,
            }));

            await SaleDetail.bulkCreate(detailsWithSaleId, { transaction: t });

            return sale;
        });

        res.status(201).json({ message: 'Venta creada con éxito', sale: result });
    } catch (error) {
        console.error('[createSale] Error:', error);
        res.status(500).json({ error: 'Error al crear la venta' });
    }
};

/**
 * Listar todas las ventas con sus detalles.
 */
export const listSales = async (req, res) => {
    try {
        const sales = await Sale.findAll({
            include: {
                model: SaleDetail,
                required: false,
            },
        });
        successAnswer(req,res, sales, 200);
    } catch (error) {
        console.error('[listSales] Error:', error);
        errorAnswer(req, res, 'Error al obtener las ventas', 500);
    }
};

/**
 * Obtener una venta específica con sus detalles.
 */
export const getSaleById = async (req, res) => {
    const { id } = req.params;

    try {
        const sale = await Sale.findByPk(id, {
            include: {
                model: SaleDetail,
                required: false,
            },
        });

        if (!sale) {
            return errorAnswer(req, res, 'Venta no encontrada', 404);
        }
        successAnswer(req,res, sale, 200);
    } catch (error) {
        console.error('[getSaleById] Error:', error);
        errorAnswer(req, res, 'Error al obtener las venta', 500);
    }
};

/**
 * Eliminar una venta y sus detalles asociados.
 */
export const deleteSale = async (req, res) => {
    const { id } = req.params;

    try {
        await sequelize.transaction(async (t) => {
            await SaleDetail.destroy({
                where: { id_venta: id },
                transaction: t,
            });

            await Sale.destroy({
                where: { id_venta: id },
                transaction: t,
            });
        });

        successAnswer(req, res, 'Venta eliminada correctamente', 200);
    } catch (error) {
        console.error('[deleteSale] Error:', error);
        errorAnswer(req,res,'Error al eliminar la venta', 500);
    }
};

/**
 * Actualizar detalles de una venta.
 */
export const updateSaleDetails = async (req, res) => {
    const { id } = req.params;
    const { details } = req.body;

    try {
        await sequelize.transaction(async (t) => {
            for (const detail of details) {
                const { id_detalle, cantidad, precio_unitario, subtotal } = detail;

                // Si existe `id_detalle`, actualiza el registro; si no, crea uno nuevo
                if (id_detalle) {
                    await SaleDetail.update(
                        { cantidad, precio_unitario, subtotal },
                        { where: { id_detalle }, transaction: t }
                    );
                } else {
                    await SaleDetail.create(
                        { ...detail, id_venta: id },
                        { transaction: t }
                    );
                }
            }
        });

        successAnswer(req, res, 'Detalles actualizados correctamente' , 200)
    } catch (error) {
        console.error('[updateSaleDetails] Error:', error);
        errorAnswer(req, res, 'Error al actualizar los detalles', 500)
    }
};
