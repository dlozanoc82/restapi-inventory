import {
    createClientQuery,
    deleteClientQuery,
    getClientByIdQuery,
    getClientsQuery,
    updateClientQuery
} from "../DB/ClientQuery.js";

const TABLE = 'clientes';

const getClientsController = () => {
    return getClientsQuery(TABLE);
}

const getClientByIdController = (id) => {
    return getClientByIdQuery(TABLE, id);
}

const createClientController = (body) => {
    return createClientQuery(TABLE, body);
}

const updateClientController = (id, body) => {
    return updateClientQuery(TABLE, body, id);
}

const deleteClientController = (body) => {
    return deleteClientQuery(TABLE, body);
}

export{
    getClientsController,
    getClientByIdController,
    createClientController,
    updateClientController,
    deleteClientController
}