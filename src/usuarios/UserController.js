import { successAnswer, errorAnswer } from "../../helpers/answersApi.js";
import Usuario from "./UsersModel.js";

// Obtener todos los usuarios de la base de datos
const getAllUsersController = async (req, res, next) => {
    try {
        const users = await Usuario.findAll();
        successAnswer(req, res, users, 200);
    } catch (error) {
        next(error);
    }
};

// Obtener los datos de un usuario específico por ID
const getUserByIdController = async (req, res, next) => {
    try {
        const user = await Usuario.findByPk(req.params.id); // Buscar por clave primaria
        if (!user) {
            return errorAnswer(req, res, "Usuario no encontrado", 404);
        }
        successAnswer(req, res, user, 200);
    } catch (error) {
        next(error);
    }
};

// Crear o actualizar los datos de un usuario
const createOrUpdateUserController = async (req, res, next) => {
    try {
        const { id_usuario, ...userData } = req.body;

        let user;
        if (!id_usuario || id_usuario === 0) {
            // Crear un nuevo usuario
            user = await Usuario.create(userData);
            successAnswer(req, res, "Usuario creado con éxito", 201);
        } else {
            // Actualizar un usuario existente
            const [updated] = await Usuario.update(userData, {
                where: { id_usuario },
            });

            if (updated) {
                successAnswer(req, res, "Usuario actualizado con éxito", 200);
            } else {
                errorAnswer(req, res, "Usuario no encontrado para actualizar", 404);
            }
        }
    } catch (error) {
        next(error);
    }
};

// Eliminar un usuario por ID
const deleteUserController = async (req, res, next) => {
    try {
        const deleted = await Usuario.destroy({
            where: { id_usuario: req.params.id },
        });

        if (deleted) {
            successAnswer(req, res, "Usuario eliminado correctamente", 200);
        } else {
            errorAnswer(req, res, "Usuario no encontrado para eliminar", 404);
        }
    } catch (error) {
        next(error);
    }
};

// Obtener un usuario por su email
const getUserByEmailController = async (email) => {
    try {
        const user = await Usuario.findOne({
            where: { email },
        });

        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

export {
    createOrUpdateUserController,
    deleteUserController,
    getAllUsersController,
    getUserByIdController,
    getUserByEmailController,
};
