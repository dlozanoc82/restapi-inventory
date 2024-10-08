import { queryDatabase } from "../config/db.js";


const getClientsQuery = async(table) => {
    const query = `SELECT * FROM ${table}`
    return await queryDatabase(query);
}

const getClientByIdQuery = () => {}

const createClientQuery = () => {}

const deleteClientQuery = () => {}

export {
    getClientsQuery,
    getClientByIdQuery,
    createClientQuery,
    deleteClientQuery
}