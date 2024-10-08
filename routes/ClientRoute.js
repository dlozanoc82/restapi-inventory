import express from "express";
import poolDb from "../config/db.js";
import { successAnswer, errorAnswer } from "../helpers/answersApi.js";
import { deleteClientController, getClientByIdController, getClientsController } from "../controllers/ClientController.js";

console.log(poolDb);

//Funciones que se ejecutan con la ruta
const getClients = async(req, res, next) => {

    try {
        const getClients = await getClientsController();
        successAnswer(req, res, getClients, 200);
    } catch (error) {
        next(error);
    }

}

const getClientById = async(req, res, next) => {

    try {
        const getClients = await getClientByIdController(req.params.id);
        successAnswer(req,res, getClients, 200);
    } catch (error) {
        next(error);
    }

}


const deleteClientById = async(req, res, next) => {

    try {
        const item = await deleteClientController(req.body);
        successAnswer(req,res, 'Cliente eliminado correctamente', 200);
    } catch (error) {
        console.log(error);
        next(error);
    }

}

//Rutas
const router = express.Router();
router.get("/", getClients);
router.get("/:id", getClientById);
router.put('/', deleteClientById)

export default router;