import { queryDatabase } from "../config/db.js";


// Función para obtener todos los registros de la tabla
const getClientsQuery = async (table) => {
    try {
        const query = `SELECT * FROM \`${table}\``;
        return await queryDatabase(query);
    } catch (error) {
        console.error(`[getClientsQuery-error]: Error fetching data from ${table}`, error);
        throw new Error(`Failed to fetch data from ${table}`);
    }
};

// Función para obtener un cliente por ID
const getClientByIdQuery = async (table, id) => {
    try {
        const query = `SELECT * FROM \`${table}\` WHERE id = ?`;
        return await queryDatabase(query, [id]);
    } catch (error) {
        console.error(`[getClientByIdQuery-error]: Error fetching data from ${table} for ID ${id}`, error);
        throw new Error(`Failed to fetch data for ID ${id} from ${table}`);
    }
};

// Función para eliminar un cliente por ID
const deleteClientQuery = async (table, data) => {
    try {
        const query = `DELETE FROM \`${table}\` WHERE id = ?`;
        return await queryDatabase(query, [data.id]);
    } catch (error) {
        console.error(`[deleteClientQuery-error]: Error deleting client with ID ${data.id} from ${table}`, error);
        throw new Error(`Failed to delete client with ID ${data.id} from ${table}`);
    }
};


const createClientQuery = async (table, data) => {
    try {
        const query = `INSERT INTO \`${table}\` SET ?`; // Simple inserción
        return await queryDatabase(query, [data]);
    } catch (error) {
        console.error(`[createClientQuery-error]: Error inserting client with data ${JSON.stringify(data)} into table ${table}`, error);
        throw new Error(`Failed to insert client with data ${JSON.stringify(data)} into table ${table}`);
    }
}

const updateClientQuery = async (table, data, id) => {
    try {
        const query = `UPDATE \`${table}\` SET ? WHERE id = ?`; // Actualización por `id`
        return await queryDatabase(query, [data, id]);
    } catch (error) {
        console.error(`[updateClientQuery-error]: Error updating client with ID ${id} in table ${table}`, error);
        throw new Error(`Failed to update client with ID ${id} in table ${table}`);
    }
}


export {
    getClientsQuery,
    getClientByIdQuery,
    createClientQuery,
    deleteClientQuery,
    updateClientQuery
}