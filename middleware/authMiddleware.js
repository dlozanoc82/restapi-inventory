import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { errorAnswer } from '../helpers/answersApi.js';

/**
 * Middleware para autenticar el token JWT.
 * Este middleware verifica si el token de autorización está presente en la cabecera HTTP y lo valida.
 * Si el token es válido, se añade la información del usuario al objeto `req`.
 * En caso contrario, responde con un error de autenticación.
 */

const authenticateToken = (req, res, next) => {
    // Extrae el token de autorización del encabezado 'authorization'
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extrae el token si existe

    // Si no se encuentra el token, responde con un error 401 (No autorizado)
    if (!token) return errorAnswer(req, res, 'Access token is missing', 401);;

    // Verifica el token utilizando la clave secreta definida en la configuración
    jwt.verify(token, config.jwt.secret, (err, user) => {
        // Si el token es inválido o ha expirado, responde con un error 403 (Prohibido)
        if (err) return errorAnswer(req, res, 'Invalid access token', 403);

        // Si el token es válido, se almacena la información del usuario en el objeto `req`
        req.user = user;

        // Llama a `next()` para continuar con el siguiente middleware o ruta
        next();
    });
};

/**
 * Middleware para autorizar el acceso basado en roles de usuario.
 * Este middleware comprueba si el rol del usuario autenticado coincide con el rol requerido para acceder a la ruta.
 * Si el rol del usuario no es suficiente, se responde con un error de autorización.
 */
const authorizeRole = (role) => {
    return (req, res, next) => {
        // Compara el rol del usuario autenticado con el rol requerido
        if (req.user.role !== role) {
            // Si el rol no coincide, responde con un error 403 (Prohibido)
            return errorAnswer(req, res,'Access forbidden: insufficient privileges', 403);
        }

        // Si el rol es adecuado, continúa con la ejecución del siguiente middleware o ruta
        next();
    };
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

// Exportación de las funciones de autenticación y autorización para su uso en otras partes del proyecto
export { authenticateToken, authorizeRole, verifyRefreshToken };
