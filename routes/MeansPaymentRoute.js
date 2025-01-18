import express from "express";
import { getMeansPayments, getMeansPaymentsById, createOrUpdateMeansPayments, deleteMeansPaymentsById} from "../src/medios_pago/MeansPaymentController.js";


//Rutas
const router = express.Router();
router.get("/", getMeansPayments);
router.get("/:id", getMeansPaymentsById);
router.delete('/:id', deleteMeansPaymentsById);
router.post('/', createOrUpdateMeansPayments);

export default router;