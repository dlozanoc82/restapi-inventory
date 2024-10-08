import { getClientsQuery } from "../DB/ClientQuery.js";

const TABLE = 'clientes';

const getClientsController = () => {
    return getClientsQuery(TABLE);
}

export{
    getClientsController,
}