import { successAnswer, errorAnswer } from "../../helpers/answersApi.js";
import Cliente from "./ClientsModel.js";

// Obtener todos los clientes
const getClients = async (req, res, next) => {
    try {
        const clients = await Cliente.findAll(); // Obtiene todos los registros de la tabla
        successAnswer(req, res, clients, 200);
    } catch (error) {
        next(error);
    }
};

// Obtener un cliente por ID
const getClientById = async (req, res, next) => {
    try {
        const client = await Cliente.findByPk(req.params.id); // Busca por clave primaria
        if (!client) {
            return errorAnswer(req, res, "Cliente no encontrado", 404);
        }
        successAnswer(req, res, client, 200);
    } catch (error) {
        next(error);
    }
};

// Eliminar un cliente por ID
const deleteClientById = async (req, res, next) => {
    try {
        const clientId = req.params.id;
        const result = await Cliente.destroy({ where: { id_cliente: clientId } }); // Elimina por condición
        if (result === 0) {
            return errorAnswer(req, res, "Cliente no encontrado", 404);
        }
        successAnswer(req, res, "Cliente eliminado correctamente", 200);
    } catch (error) {
        next(error);
    }
};

// Crear o actualizar un cliente
const createOrUpdateClient = async (req, res, next) => {
    try {
        const { id_cliente, ...clientData } = req.body;

        let message;
        if (!id_cliente) {
            // Crear nuevo cliente si no hay ID
            await Cliente.create(clientData);
            message = "Cliente creado con éxito";
        } else {
            // Actualizar cliente si hay un ID
            const [updatedRows] = await Cliente.update(clientData, {
                where: { id_cliente },
            });
            if (updatedRows === 0) {
                return errorAnswer(req, res, "Cliente no encontrado", 404);
            }
            message = "Cliente actualizado con éxito";
        }

        successAnswer(req, res, message, 201);
    } catch (error) {
        next(error);
    }
};

export {
    getClients,
    getClientById,
    deleteClientById,
    createOrUpdateClient,
};
