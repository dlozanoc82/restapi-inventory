import {
    deleteClientQuery,
    getClientByIdQuery,
    getClientsQuery
} from "../DB/ClientQuery.js";

const TABLE = 'clientes';

const getClientsController = () => {
    return getClientsQuery(TABLE);
}

const getClientByIdController = (id) => {
    return getClientByIdQuery(TABLE, id);
}

const deleteClientController = (body) => {
    return deleteClientQuery(TABLE, body);
}

export{
    getClientsController,
    getClientByIdController,
    deleteClientController
}