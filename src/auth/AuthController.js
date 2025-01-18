import RefreshToken from "./RefreshTokenModel.js";
import UsuarioLog from "./UsersLogsModel.js";
import { errorAnswer, successAnswer } from "../../helpers/answersApi.js";
import { generateAccessToken, generateRefreshToken } from "../../helpers/token.js";
import { getUserByEmailController } from "../usuarios/UserController.js";
import { verifyRefreshToken } from "../../middleware/authMiddleware.js";

// Controlador de login
const loginController = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await getUserByEmailController(email);

        if (!user || user.password !== password) {
            return errorAnswer(req, res, 'Invalid credentials', 401);
        }

        const userPayload = { id: user.id_usuario, role: user.rol_usuario };
        const accessToken = generateAccessToken(userPayload);
        const refreshToken = generateRefreshToken(userPayload);

        // Guardar refresh token en la base de datos
        await RefreshToken.create({
            id_usuario: user.id_usuario,
            token: refreshToken
        });

        // Log del inicio de sesión
        await UsuarioLog.create({ id_usuario: user.id_usuario });

        const responseBody = {
            accessToken,
            refreshToken,
            name: user.nombre_usuario,
            role: user.rol_usuario
        };

        successAnswer(req, res, responseBody, 200);
    } catch (error) {
        next(error);
    }
};

// Controlador de logout
const logoutController = async (req, res, next) => {
    const { refreshToken } = req.body;

    try {
        const token = await RefreshToken.findOne({ where: { token: refreshToken } });

        if (!token) {
            return errorAnswer(req, res, 'Invalid token', 400);
        }

        // Eliminar token de la base de datos
        await RefreshToken.destroy({ where: { token: refreshToken } });

        // Log del cierre de sesión
        await UsuarioLog.update(
            { logout_time: new Date() },
            {
                where: {
                    id_usuario: token.id_usuario,
                    logout_time: null
                },
                order: [['login_time', 'DESC']],
                limit: 1
            }
        );

        successAnswer(req, res, 'Logged out successfully', 200);
    } catch (error) {
        next(error);
    }
};

// Controlador para refrescar el token de acceso
const refreshAccessToken = async (req, res, next) => {
    const { refreshToken } = req.body;

    try {
        const userPayload = verifyRefreshToken(refreshToken);

        const storedToken = await RefreshToken.findOne({
            where: { id_usuario: userPayload.id, token: refreshToken }
        });

        if (!storedToken) {
            return errorAnswer(req, res, 'Refresh token is not valid', 403);
        }

        const newAccessToken = generateAccessToken({
            id: userPayload.id,
            role: userPayload.role
        });

        successAnswer(req, res, { accessToken: newAccessToken }, 200);
    } catch (error) {
        return errorAnswer(req, res, 'Invalid or expired refresh token', 403);
    }
};

export { loginController, logoutController, refreshAccessToken };
