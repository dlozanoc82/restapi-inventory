import express from 'express';
import {
    createApartado,
    getApartados,
    getApartadoById,
    createAbono,
    deleteApartado,
    updateAbono,
    updateApartadoDetails,
    getApartadoDetailsById,
    getApartadoAbonosById
} from '../src/apartados/SeparateController.js';

const router = express.Router();

router.get('/apartados', getApartados);
router.get('/apartados/:id', getApartadoById);
router.post('/apartados', createApartado);
router.delete('/apartados/:id', deleteApartado);
router.put('/apartados/:id/details', updateApartadoDetails);
router.get('/apartados-details/:id', getApartadoDetailsById);



router.get('/abonos-details/:id', getApartadoAbonosById);
router.post('/abonos', createAbono);
router.put('/abonos/:id_abono', updateAbono);

export default router;
