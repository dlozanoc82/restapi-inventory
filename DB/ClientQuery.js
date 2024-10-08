import { queryDatabase } from "../config/db.js";


const getClientsQuery = async(table) => {
    const query = `SELECT * FROM ${table}`
    return await queryDatabase(query);
}

const getClientByIdQuery = async(table, id) => {
    const query = `SELECT * FROM ${table} WHERE id = ?`
    return await queryDatabase(query, [id]);
}

const createClientQuery = () => {}

const deleteClientQuery = async(table, data) => {
    const query = `DELETE FROM ${table} WHERE id = ?`
    return await queryDatabase(query, [data.id]);
}

export {
    getClientsQuery,
    getClientByIdQuery,
    createClientQuery,
    deleteClientQuery
}