import mysql from 'mysql2/promise';
import { config } from './config';

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
}

let dbConection;

function connectionMySQL() {
    dbConection = mysql.createPool(dbconfig);

    dbConection.connect((error) => {
        if (error) {
            console.log('[db-err]', error);
            setTimeout(connectionMySQL,200);
        }else{
            console.log('Conexion a la Base de Datos Exitosa !!!')
        }
    })

    dbConection.on('error', error => {
        console.log('[db-err]', error);
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            connectionMySQL();
        } else {
            throw error;
        }
    })

}

connectionMySQL();


export default dbConection;