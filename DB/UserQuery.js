import { queryDatabase } from '../config/db.js'; 

const getAllUsersQuery = async (table) => {
    const query = `SELECT * FROM \`${table}\``;
    const users = await queryDatabase(query);
    return users;
};

const getUserByIdQuery = async (table, id) => {
    try {
        const query = `SELECT * FROM \`${table}\` WHERE id_usuario = ?`;
        return await queryDatabase(query, [id]);
    } catch (error) {
        console.error(`[getClientByIdQuery-error]: Error fetching data from ${table} for ID ${id}`, error);
        throw new Error(`Failed to fetch data for ID ${id} from ${table}`);
    }
};

const createUserQuery = async (table, userData) => {
    const columns = Object.keys(userData).join(', ');
    const placeholders = Object.keys(userData).map(() => '?').join(', ');
    const values = Object.values(userData);

    const query = `INSERT INTO \`${table}\` (${columns}) VALUES (${placeholders})`;
    const result = await queryDatabase(query, values);

    return { id: result.insertId, ...userData };
};

const updateUserQuery = async (table, id_usuario, userData) => {
    const updates = Object.keys(userData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(userData), id_usuario];

    const query = `UPDATE \`${table}\` SET ${updates} WHERE id_usuario = ?`;
    await queryDatabase(query, values);

    return { id_usuario, ...userData };
};


const deleteUserQuery = async (table, id) => {
    const query = `DELETE FROM \`${table}\` WHERE id_usuario = ?`;
    await queryDatabase(query, [id]);
};


const getUserByEmailQuery = async (table, email) => {
    const query = `SELECT * FROM \`${table}\` WHERE email = ?`;
    const result = await queryDatabase(query, [email]);

    // Devuelve el primer usuario encontrado o null si no existe
    return result.length > 0 ? result[0] : null;
};


export {
    createUserQuery,
    updateUserQuery,
    deleteUserQuery,
    getAllUsersQuery,
    getUserByIdQuery,
    getUserByEmailQuery
};
