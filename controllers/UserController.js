import {
    createUserQuery,
    updateUserQuery,
    deleteUserQuery,
    getAllUsersQuery,
    getUserByIdQuery,
    getUserByEmailQuery
} from "../DB/UserQuery.js";
import { successAnswer } from "../helpers/answersApi.js";

const TABLE = 'usuarios';


//OBTENER USUARIOS DE LA BD
const getAllUsersController = async (req, res, next) => {
    try {
        const users = await getAllUsersQuery(TABLE);
        successAnswer(req, res, users, 200);
    } catch (error) {
        next(error);
    }
};

//Obtiene los datos de un solo usuario de la BD
const getUserByIdController = async(req, res, next) => {

    try {
        const getUser = await getUserByIdQuery(TABLE, req.params.id);
        successAnswer(req,res, getUser, 200);
    } catch (error) {
        next(error);
    }

}


//CREAR O ACTUALIZAR LOS DATOS EN LA BD
const createOrUpdateUserController = async (req, res, next) => {

    try {
        let message = '';
        const { id, ...userData } = req.body;

        if (id === 0 || !id) {
            // Crear usuario si no hay ID o si es 0
            const newUser = await createUserQuery(TABLE, userData.name, userData.email, userData.password, userData.role);
            message = 'Usuario creado con éxito';
        } else {
            // Actualizar usuario si hay un ID
            const updatedUser = await updateUserQuery(TABLE, id, userData);
            message = 'Usuario actualizado con éxito';
        }

        successAnswer(req, res, message, 201);
    } catch (error) {
        next(error);
    }
};


//ELIMINA UN USUARIO
const deleteUserController = async (req, res, next) => {
    const { id } = req.body;
    try {
        await deleteUserQuery(TABLE, id);
        successAnswer(req, res, 'Usuario eliminado correctamente', 200);
    } catch (error) {
        next(error);
    }
};


const getUserByEmailController = async (email) => {
    try {
        const user = await getUserByEmailQuery(TABLE, email);
        if (!user) {
            throw new Error('User not found');
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
    getUserByEmailController
};
