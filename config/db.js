import mysql from 'mysql2/promise';
import { config } from './config.js';

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
};

console.log(dbconfig.database);

// Crea un pool de conexiones
const poolDb = mysql.createPool(dbconfig);

// Función para realizar consultas a la base de datos
export async function queryDatabase(query, params, connection = null) {
    try {
        const conn = connection || poolDb;
        const [rows] = await conn.query(query, params);
        return rows;
    } catch (error) {
        console.error('[db-err]', error);
        throw error; // Propaga el error
    }
}

// Función para iniciar una transacción
export async function startTransaction() {
    const connection = await poolDb.getConnection(); // Obtén una conexión del pool
    await connection.beginTransaction(); // Inicia la transacción
    return connection; // Devuelve la conexión activa
}

// Función para confirmar una transacción
export async function commitTransaction(connection) {
    try {
        await connection.commit(); // Confirma la transacción
    } finally {
        connection.release(); // Libera la conexión
    }
}

// Función para deshacer una transacción
export async function rollbackTransaction(connection) {
    try {
        await connection.rollback(); // Deshace la transacción
    } finally {
        connection.release(); // Libera la conexión
    }
}

// Función para comprobar la conexión inicial
async function connectionMySQL() {
    try {
        // Intenta obtener una conexión
        const connection = await poolDb.getConnection();
        console.log('Conexión a la Base de Datos Exitosa !!!');
        connection.release(); // Libera la conexión
    } catch (error) {
        console.error('[db-err]', error);
        setTimeout(connectionMySQL, 200); // Reintenta después de 200ms
    }
}

// Llama a la función para comprobar la conexión al iniciar
connectionMySQL();

export default poolDb;
