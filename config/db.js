import mysql from 'mysql2/promise';
import { config } from './config.js';

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
};

// Crea un pool de conexiones
const poolDb = mysql.createPool(dbconfig);

// Función para realizar consultas a la base de datos
export async function queryDatabase(query, params) {
    try {
        const [rows] = await poolDb.query(query, params);
        return rows;
    } catch (error) {
        console.error('[db-err]', error);
        throw error; // Propaga el error
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