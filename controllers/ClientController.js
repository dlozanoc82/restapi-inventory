import {
    createClientQuery,
    deleteClientQuery,
    getClientByIdQuery,
    getClientsQuery,
    updateClientQuery
} from "../DB/ClientQuery.js";
import { successAnswer } from "../helpers/answersApi.js";

const TABLE = 'clientes';

//Obtiene los datos de todos los clientes de la BD
const getClients = async(req, res, next) => {

    try {
        const getClients = await getClientsQuery(TABLE);
        successAnswer(req, res, getClients, 200);
    } catch (error) {
        next(error);
    }
}

//Obtiene los datos de un solo cliente de la BD
const getClientById = async(req, res, next) => {

    try {
        const getClients = await getClientByIdQuery(TABLE, req.params.id);
        successAnswer(req,res, getClients, 200);
    } catch (error) {
        next(error);
    }

}

//Elimina un  cliente
const deleteClientById = async(req, res, next) => {

    try {
        const item = await deleteClientQuery(TABLE, req.body);
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
            const newItem = await createClientQuery(TABLE, clientData);
            message = 'Cliente creado con éxito';
        } else {
            // Actualizar cliente si hay un ID
            const updatedItem = await updateClientQuery(TABLE, clientData, id);
            message = 'Cliente actualizado con éxito';
        }
        successAnswer(req, res, message, 201);
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export{
    deleteClientById,
    createOrUpdateClient,
    getClientById,
    getClients
}