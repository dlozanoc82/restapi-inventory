import { queryDatabase } from '../config/db.js'; 

const getAllUsersQuery = async (table) => {
    const query = `SELECT * FROM \`${table}\``;
    const users = await queryDatabase(query);
    return users;
};

const getUserByIdQuery = async (table, id) => {
    try {
        const query = `SELECT * FROM \`${table}\` WHERE id = ?`;
        return await queryDatabase(query, [id]);
    } catch (error) {
        console.error(`[getClientByIdQuery-error]: Error fetching data from ${table} for ID ${id}`, error);
        throw new Error(`Failed to fetch data for ID ${id} from ${table}`);
    }
};

const createUserQuery = async (table, name, email, password, role) => {
    const query = `INSERT INTO \`${table}\` (name, email, password, role) VALUES (?, ?, ?, ?)`;
    const result = await queryDatabase(query, [name, email, password, role]);

    // Devuelve el objeto del usuario recién creado, incluyendo el ID generado
    return { id: result.insertId, name, email, role };
};

const updateUserQuery = async (table, id, { name, email, role }) => {
    const query = `UPDATE \`${table}\` SET name = ?, email = ?, role = ? WHERE id = ?`;
    await queryDatabase(query, [name, email, role, id]);

    // Devuelve el objeto del usuario actualizado
    return { id, name, email, role };
};

const deleteUserQuery = async (table, id) => {
    const query = `DELETE FROM \`${table}\` WHERE id = ?`;
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
