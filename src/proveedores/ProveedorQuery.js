import { queryDatabase } from "../../config/db.js"; 

// Función para obtener todos los registros de la tabla
const getSuppliersQuery = async (table) => {
    try {
        const query = `SELECT * FROM \`${table}\``;
        return await queryDatabase(query);
    } catch (error) {
        console.error(`[getSuppliersQuery-error]: Error fetching data from ${table}`, error);
        throw new Error(`Failed to fetch data from ${table}`);
    }
};

// Función para obtener un cliente por ID
const getSupplierByIdQuery = async (table, id) => {
    try {
        const query = `SELECT * FROM \`${table}\` WHERE id_proveedor = ?`;
        return await queryDatabase(query, [id]);
    } catch (error) {
        console.error(`[getSupplierByIdQuery-error]: Error fetching data from ${table} for ID ${id}`, error);
        throw new Error(`Failed to fetch data for ID ${id} from ${table}`);
    }
};

// Función para eliminar un cliente por ID
const deleteSupplierQuery = async (table, id) => {
    try {
        const query = `DELETE FROM \`${table}\` WHERE id_proveedor = ?`;
        return await queryDatabase(query, id);
    } catch (error) {
        console.error(`[deleteSupplierQuery-error]: Error deleting supplier with ID ${id} from ${table}`, error);
        throw new Error(`Failed to delete supplier with ID ${id} from ${table}`);
    }
};


const createSupplierQuery = async (table, data) => {
    try {
        const query = `INSERT INTO \`${table}\` SET ?`; // Simple inserción
        return await queryDatabase(query, [data]);
    } catch (error) {
        console.error(`[createSupplierQuery-error]: Error inserting supplier with data ${JSON.stringify(data)} into table ${table}`, error);
        throw new Error(`Failed to insert supplier with data ${JSON.stringify(data)} into table ${table}`);
    }
}

const updateSupplierQuery = async (table, data, id) => {
    try {
        const query = `UPDATE \`${table}\` SET ? WHERE id_proveedor = ?`; // Actualización por `id`
        return await queryDatabase(query, [data, id]);
    } catch (error) {
        console.error(`[updateSupplierQuery-error]: Error updating supplier with ID ${id} in table ${table}`, error);
        throw new Error(`Failed to update supplier with ID ${id} in table ${table}`);
    }
}


export {
    getSuppliersQuery,
    getSupplierByIdQuery,
    createSupplierQuery,
    updateSupplierQuery,
    deleteSupplierQuery
}