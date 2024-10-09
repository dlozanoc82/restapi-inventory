import express from "express";
import poolDb from "../config/db.js";
import { successAnswer, errorAnswer } from "../helpers/answersApi.js";
import { createClientController, deleteClientController, getClientByIdController, getClientsController, updateClientController } from "../controllers/ClientController.js";

console.log(poolDb);

//Obtiene los datos de todos los clientes de la BD
const getClients = async(req, res, next) => {

    try {
        const getClients = await getClientsController();
        successAnswer(req, res, getClients, 200);
    } catch (error) {
        next(error);
    }

}

//Obtiene los datos de un solo cliente de la BD
const getClientById = async(req, res, next) => {

    try {
        const getClients = await getClientByIdController(req.params.id);
        successAnswer(req,res, getClients, 200);
    } catch (error) {
        next(error);
    }

}


//Elimina un  cliente
const deleteClientById = async(req, res, next) => {

    try {
        const item = await deleteClientController(req.body);
        successAnswer(req,res, 'Cliente eliminado correctamente', 200);
    } catch (error) {
        console.log(error);
        next(error);
    }

}

//Agrega o actualiza un cliente
const createOrUpdateClient = async (req, res, next) => {
    try {
        let message = '';
        const { id, ...clientData } = req.body;

        if (id === 0 || !id) {
            // Crear cliente si no hay ID o si es 0
            const newItem = await createClientController(clientData);
            message = 'Cliente creado con éxito';
        } else {
            // Actualizar cliente si hay un ID
            const updatedItem = await updateClientController(id, clientData);
            message = 'Cliente actualizado con éxito';
        }

        successAnswer(req, res, message, 201);
    } catch (error) {
        console.error(error);
        next(error);
    }
}


//Rutas
const router = express.Router();
router.get("/", getClients);
router.get("/:id", getClientById);
router.put('/', deleteClientById)
router.post('/', createOrUpdateClient)

export default router;