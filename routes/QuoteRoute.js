import express from 'express';
import {
    createQuote,
    listQuotes,
    getQuoteById,
    deleteQuote,
    updateQuoteDetails,
    getQuoteDetailById
} from '../src/cotizaciones/QuoteController.js';

const router = express.Router();

router.post('/cotizaciones', createQuote); // Crear una venta
router.get('/cotizaciones', listQuotes); // Listar todas las ventas
router.get('/cotizaciones/:id', getQuoteById); // Obtener una venta por ID

router.get('/cotizaciones-details/:id', getQuoteDetailById); // Obtener una venta por ID
router.delete('/cotizaciones/:id', deleteQuote); // Eliminar una venta
router.put('/cotizaciones/:id/details', updateQuoteDetails); // Actualizar detalles de una venta

export default router;
