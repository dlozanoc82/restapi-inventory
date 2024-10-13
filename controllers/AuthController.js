import { deleteRefreshToken, getRefreshTokenByUser, storeRefreshToken, verifyRefreshToken } from "../DB/AuthQuery.js";
import { errorAnswer, successAnswer } from "../helpers/answersApi.js";
import { generateAccessToken, generateRefreshToken } from "../helpers/token.js";
import { getUserByEmailController } from "./UserController.js";

// Controlador de login - maneja el inicio de sesión y autenticación de usuarios
const loginController = async (req, res, next) => {

    // Extraer email y password del cuerpo de la solicitud
    const { email, password } = req.body; 

    try {
        // Buscar al usuario en la base de datos por su email
        const user = await getUserByEmailController(email);

        // Si el usuario no existe o la contraseña es incorrecta, devolver error
        if (!user || user.password !== password) {
            return errorAnswer(req, res, 'Invalid credentials', 401);
        }

        // Crear payload del usuario con su id y rol
        const userPayload = { id: user.id, role: user.role };

        // Generar tokens de acceso y refresh para el usuario
        const accessToken = generateAccessToken(userPayload);
        const refreshToken = generateRefreshToken(userPayload);

        // Guardar el token de refresh en la base de datos
        await storeRefreshToken(refreshToken, user.id);

        // Crear la respuesta con el nombre del usuario, su rol, y los tokens
        const responseBody = {
            accessToken,
            refreshToken,
            name: user.name,
            role: user.role
        };

        // Enviar respuesta exitosa con los datos del usuario y tokens
        successAnswer(req, res, responseBody, 200);
    } catch (error) {
        // Si ocurre un error, pasar el error al middleware de manejo de errores
        next(error);
    }
};


// Controlador de logout - maneja el cierre de sesión del usuario
const logoutController = async (req, res, next) => {

    // Extraer el token de refresh del cuerpo de la solicitud
    const { refreshToken } = req.body;

    try {
        // Verificar la validez del token de refresh
        const decodedToken = verifyRefreshToken(refreshToken);
        const userId = decodedToken.id;  // Obtener el id del usuario del token

        // Verificar si el token existe en la base de datos
        const tokenInDb = await getRefreshTokenByUser(userId, refreshToken);
        if (!tokenInDb) {
            return errorAnswer(req, res, 'Invalid token', 400);
        }

        // Eliminar el token de refresh de la base de datos (cerrar sesión)
        await deleteRefreshToken(refreshToken);

        // Respuesta exitosa confirmando el logout
        successAnswer(req, res, 'Logged out successfully', 200);
    } catch (error) {
        // Pasar el error al middleware de manejo de errores
        next(error);
    }
};


// Controlador para refrescar el token de acceso - genera un nuevo access token
const refreshAccessToken = async (req, res, next) => {

    // Extraer el token de refresh del cuerpo de la solicitud
    const { refreshToken } = req.body;

    try {
        // Verificar el token de refresh
        const userPayload = verifyRefreshToken(refreshToken);

        // Comprobar si el token de refresh está almacenado en la base de datos
        const storedToken = await getRefreshTokenByUser(userPayload.id, refreshToken);
        if (!storedToken) {
            return errorAnswer(req, res, 'Refresh token is not valid', 403);
        }

        // Generar un nuevo access token
        const newAccessToken = generateAccessToken({ id: userPayload.id, role: userPayload.role });

        // Enviar el nuevo access token en la respuesta
        successAnswer(req, res, { accessToken: newAccessToken }, 200);
    } catch (error) {
        console.error(error);
        return errorAnswer(req, res, 'Invalid or expired refresh token', 403);
    }
};



export {
    loginController,
    logoutController,
    refreshAccessToken
};
