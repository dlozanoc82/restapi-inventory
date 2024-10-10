import { deleteRefreshToken, getRefreshTokenByUser, storeRefreshToken, verifyRefreshToken } from "../DB/AuthQuery.js";
import { errorAnswer, successAnswer } from "../helpers/answersApi.js";
import { generateAccessToken, generateRefreshToken } from "../helpers/token.js";
import { getUserByEmailController } from "./UserController.js";

const loginController = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await getUserByEmailController(email);

        if (!user || user.password !== password) {
            return errorAnswer(req, res, 'Invalid credentials', 401);
        }

        const userPayload = { id: user.id, role: user.role };
        const accessToken = generateAccessToken(userPayload);
        const refreshToken = generateRefreshToken(userPayload);

        await storeRefreshToken(refreshToken, user.id);
        successAnswer(req, res, { accessToken, refreshToken }, 200);
    } catch (error) {
        next(error);
    }
};

const logoutController = async (req, res, next) => {
    const { refreshToken } = req.body;
    try {
        const decodedToken = verifyRefreshToken(refreshToken);
        const userId = decodedToken.id;

        const tokenInDb = await getRefreshTokenByUser(userId, refreshToken);
        if (!tokenInDb) {
            return errorAnswer(req, res, 'Invalid token', 400);
        }

        await deleteRefreshToken(refreshToken);
        successAnswer(req, res, 'Logged out successfully', 200);
    } catch (error) {
        next(error);
    }
};

const refreshAccessToken = async (req, res, next) => {
    const { refreshToken } = req.body;

    try {
        const userPayload = verifyRefreshToken(refreshToken);
        const storedToken = await getRefreshTokenByUser(userPayload.id, refreshToken);

        if (!storedToken) {
            return errorAnswer(req, res, 'Refresh token is not valid', 403);
        }

        const newAccessToken = generateAccessToken({ id: userPayload.id, role: userPayload.role });
        successAnswer(req, res, { accessToken: newAccessToken }, 200);
    } catch (error) {
        console.error(error);
        return errorAnswer(req, res, 'Invalid or expired refresh token', 403);
    }
};

export { loginController, logoutController, refreshAccessToken };
