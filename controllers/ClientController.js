import {
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

export{
    getClientsController,
    getClientByIdController
}