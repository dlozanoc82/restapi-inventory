import jwt from 'jsonwebtoken';
import { queryDatabase } from '../config/db.js'; 
import { config } from '../config/config.js';

const storeRefreshToken = async (token, userId) => {
    try {
        const query = `INSERT INTO refresh_tokens (id_usuario, token) VALUES (?, ?)`;
        await queryDatabase(query, [userId, token]);
    } catch (error) {
        console.error('Error saving refresh token', error);
        throw new Error('Failed to save refresh token');
    }
};

const deleteRefreshToken = async (token) => {
    try {
        const query = `DELETE FROM refresh_tokens WHERE token = ?`;
        await queryDatabase(query, [token]);
    } catch (error) {
        console.error('Error deleting refresh token', error);
        throw new Error('Failed to delete refresh token');
    }
};

const getRefreshTokenByUser = async (userId, token) => {
    const query = `SELECT * FROM refresh_tokens WHERE id_usuario = ? AND token = ?`;
    const result = await queryDatabase(query, [userId, token]);
    return result.length > 0 ? result[0] : null;
};

const verifyRefreshToken = (token) => {
    try {
        // Verificar el token con la clave secreta usada para firmarlo
        const decoded = jwt.verify(token, config.jwt.refreshSecret);
        console.log({decoded})
        return decoded;  // Devuelve el payload del token (por ejemplo, { id, role })
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};


// Función para registrar el inicio de sesión
const logUserLogin = async (userId) => {
    try {
        const query = `INSERT INTO usuario_logs (id_usuario) VALUES (?)`;
        await queryDatabase(query, [userId]);
    } catch (error) {
        console.error('Error logging user login', error);
        throw new Error('Failed to log user login');
    }
};

// Función para registrar el cierre de sesión
const logUserLogout = async (userId) => {
    try {
        const query = `UPDATE usuario_logs SET logout_time = CURRENT_TIMESTAMP WHERE id_usuario = ? AND logout_time IS NULL ORDER BY login_time DESC LIMIT 1`;
        await queryDatabase(query, [userId]);
    } catch (error) {
        console.error('Error logging user logout', error);
        throw new Error('Failed to log user logout');
    }
};

export {
    storeRefreshToken,
    deleteRefreshToken,
    getRefreshTokenByUser,
    verifyRefreshToken,
    logUserLogin,
    logUserLogout
};
