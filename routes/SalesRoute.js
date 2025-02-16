import express from 'express';
import {
    createSale,
    listSales,
    getSaleById,
    deleteSale,
    updateSaleDetails,
    getSaleDetailById,
    generateInvoice,
} from '../src/sales/SalesController.js';

const router = express.Router();

router.post('/sales', createSale); // Crear una venta
router.get('/sales', listSales); // Listar todas las ventas
router.get('/sales/:id', getSaleById); // Obtener una venta por ID
router.get('/sales-details/:id', getSaleDetailById); // Obtener los detalles de una Venta por el ID
router.delete('/sales/:id', deleteSale); // Eliminar una venta
router.put('/sales/:id/details', updateSaleDetails); // Actualizar detalles de una venta

router.get('/invoice/:id', generateInvoice);

export default router;
