import { queryDatabase } from "../../config/db.js"; 

// Función para obtener todos los registros de la tabla
const getProductsQuery = async (table) => {
    try {
        const query = `SELECT * FROM \`${table}\``;
        return await queryDatabase(query);
    } catch (error) {
        console.error(`[getProductsQuery-error]: Error fetching data from ${table}`, error);
        throw new Error(`Failed to fetch data from ${table}`);
    }
};

// Función para obtener un cliente por ID
const getProductByIdQuery = async (table, id) => {
    try {
        const query = `SELECT * FROM \`${table}\` WHERE id_producto = ?`;
        return await queryDatabase(query, [id]);
    } catch (error) {
        console.error(`[getProductByIdQuery-error]: Error fetching data from ${table} for ID ${id}`, error);
        throw new Error(`Failed to fetch data for ID ${id} from ${table}`);
    }
};

// Función para eliminar un cliente por ID
const deleteProductQuery = async (table, id) => {
    try {
        const query = `DELETE FROM \`${table}\` WHERE id_producto = ?`;
        return await queryDatabase(query, id);
    } catch (error) {
        console.error(`[deleteProductQuery-error]: Error deleting product with ID ${id} from ${table}`, error);
        throw new Error(`Failed to delete product with ID ${id} from ${table}`);
    }
};


const createProductQuery = async (table, data) => {
    try {
        const query = `INSERT INTO \`${table}\` SET ?`; // Simple inserción
        return await queryDatabase(query, [data]);
    } catch (error) {
        console.error(`[createProductQuery-error]: Error inserting product with data ${JSON.stringify(data)} into table ${table}`, error);
        throw new Error(`Failed to insert product with data ${JSON.stringify(data)} into table ${table}`);
    }
}

const updateProductQuery = async (table, data, id) => {
    try {
        const query = `UPDATE \`${table}\` SET ? WHERE id_producto = ?`; // Actualización por `id`
        return await queryDatabase(query, [data, id]);
    } catch (error) {
        console.error(`[updateProductQuery-error]: Error updating product with ID ${id} in table ${table}`, error);
        throw new Error(`Failed to update product with ID ${id} in table ${table}`);
    }
}


export {
    getProductsQuery,
    getProductByIdQuery,
    createProductQuery,
    deleteProductQuery,
    updateProductQuery
}