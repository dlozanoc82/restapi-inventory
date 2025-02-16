import PDFDocument from 'pdfkit';
import Sale from './Sales.js';
import SaleDetail from './SalesDetail.js'
import sequelize from '../../config/dbs.js'; 
import { errorAnswer, successAnswer } from '../../helpers/answersApi.js';
import Cliente from '../clientes/ClientsModel.js';
import Usuario from '../usuarios/UsersModel.js';
import MedioDePago from '../medios_pago/MeansPaymentModel.js';
import Producto from '../productos/ProductModel.js';
import { generateCustomerInformation, generateFooter, generateHeader, generateInvoiceTable } from '../../helpers/pdfGenerator.js';


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
            include: [ 
                {
                    model: SaleDetail,
                    as: 'sale_details',
                    required: false,
                },
                {
                    model: Cliente,
                    as: 'cliente',
                    attributes: ['nombre_cliente', 'apellido_cliente']
                },
                {
                    model: Usuario,
                    as: 'vendedor',
                    attributes: ['nombre_usuario', 'apellido_usuario']
                },
                {
                    model: MedioDePago,
                    as: 'medio_pago',
                    attributes: ['nombre_mdspagos']
                }

            ]
        });

        const formattedSales =  await sales.map(sale => ({
            id_venta: sale.id_venta,
            fecha_venta: sale.fecha_venta,
            total: sale.total,
            cliente: sale.cliente ? `${sale.cliente.nombre_cliente} ${sale.cliente.apellido_cliente}` : null,
            medio_pago: sale.medio_pago ? sale.medio_pago.nombre_mdspagos : null,
            vendedor: sale.vendedor ? `${sale.vendedor.nombre_usuario} ${sale.vendedor.apellido_usuario}` : null,
            sale_details: sale.sale_details.map(detail => ({
                id_detalle: detail.id_detalle,
                id_venta: detail.id_venta,
                id_producto: detail.id_producto,
                cantidad: detail.cantidad,
                precio_unitario: detail.precio_unitario,
                subtotal: detail.subtotal,
            }))
        }));

        successAnswer(req,res, formattedSales, 200);
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
            include: [
                {
                    model: SaleDetail,
                    as: 'sale_details',
                    include: {
                        model: Producto,
                        as: 'producto',
                        attributes: ['nombre_producto']
                    }
                },
                {
                    model: Cliente,
                    as: 'cliente',
                    attributes: ['nombre_cliente', 'apellido_cliente']
                },
                {
                    model: Usuario,
                    as: 'vendedor',
                    attributes: ['nombre_usuario', 'apellido_usuario']
                },
                {
                    model: MedioDePago,
                    as: 'medio_pago',
                    attributes: ['nombre_mdspagos']
                }
            ]
        });

        if (!sale) {
            return errorAnswer(req, res, 'Venta no encontrada', 404);
        }

        // Formatear respuesta
        const formattedSale = {
            id_venta: sale.id_venta,
            fecha_venta: sale.fecha_venta,
            total: sale.total,
            cliente: sale.cliente ? `${sale.cliente.nombre_cliente} ${sale.cliente.apellido_cliente}` : 'No especificado',
            medio_pago: sale.medio_pago ? sale.medio_pago.nombre_mdspagos : 'No especificado',
            vendedor: sale.vendedor ? `${sale.vendedor.nombre_usuario} ${sale.vendedor.apellido_usuario}` : 'No especificado',
            sale_details: sale.sale_details.map(detail => ({
                ...detail.get({ plain: true }),
                nombre_producto: detail.producto.nombre_producto
            }))
        };

        successAnswer(req, res, formattedSale, 200);
    } catch (error) {
        console.error('[getSaleById] Error:', error);
        errorAnswer(req, res, 'Error al obtener la venta', 500);
    }
};

export const generateInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar la venta directamente en la base de datos
        const saleResponse = await Sale.findByPk(id, {
            include: [
                {
                    model: SaleDetail,
                    as: 'sale_details',
                    include: {
                        model: Producto,
                        as: 'producto',
                        attributes: ['nombre_producto']
                    }
                },
                {
                    model: Cliente,
                    as: 'cliente',
                    attributes: ['nombre_cliente', 'apellido_cliente']
                },
                {
                    model: Usuario,
                    as: 'vendedor',
                    attributes: ['nombre_usuario', 'apellido_usuario']
                },
                {
                    model: MedioDePago,
                    as: 'medio_pago',
                    attributes: ['nombre_mdspagos']
                }
            ]
        });

        if (!saleResponse) {
            return errorAnswer(req, res, 'Venta no encontrada', 404);
        }

        // Formatear la respuesta
        const saleData = {
            id_venta: saleResponse.id_venta,
            fecha_venta: saleResponse.fecha_venta,
            total: saleResponse.total,
            cliente: saleResponse.cliente ? `${saleResponse.cliente.nombre_cliente} ${saleResponse.cliente.apellido_cliente}` : 'No especificado',
            medio_pago: saleResponse.medio_pago ? saleResponse.medio_pago.nombre_mdspagos : 'No especificado',
            vendedor: saleResponse.vendedor ? `${saleResponse.vendedor.nombre_usuario} ${saleResponse.vendedor.apellido_usuario}` : 'No especificado',
            sale_details: saleResponse.sale_details.map(detail => ({
                ...detail.get({ plain: true }),
                nombre_producto: detail.producto.nombre_producto
            }))
        };


        // Configurar documento PDF
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="factura_${saleData.id_venta}.pdf"`);

        doc.pipe(res);

        // Generar PDF
        generateHeader(doc);
        generateCustomerInformation(doc, saleData);
        generateInvoiceTable(doc, saleData);
        generateFooter(doc);

        doc.end();
    } catch (error) {
        console.error('[generateInvoice] Error:', error);
        errorAnswer(req, res, 'Error generando el PDF', 500);
    }
};


/**
 * Obtener los detalles de una venta específica con sus detalles.
 */
export const getSaleDetailById = async (req, res) => {
    const { id } = req.params;

    try {
        const sale = await Sale.findByPk(id, {
            include: {
                model: SaleDetail,
                required: false,
                as: 'sale_details',
                include: {
                    model: Producto,
                    required: false,
                    as: 'producto',
                    attributes: ['nombre_producto', 'imagen_producto']
                }
            },
        });

        if (!sale) {
            return errorAnswer(req, res, 'Venta no encontrada', 404);
        }

        successAnswer(req,res, sale.sale_details, 200);
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
