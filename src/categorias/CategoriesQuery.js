import { queryDatabase } from "../../config/db.js"; 

// Queries para Categorías

const getCategoriesQuery = async (table) => {
    try {
        const query = `SELECT * FROM \`${table}\``;
        return await queryDatabase(query);
    } catch (error) {
        console.error(`[getCategoriesQuery-error]: Error fetching data from ${table}`, error);
        throw new Error(`Failed to fetch data from ${table}`);
    }
};

const getCategoryByIdQuery = async (table, id) => {
    try {
        const query = `SELECT * FROM \`${table}\` WHERE id_categoria = ?`;
        return await queryDatabase(query, [id]);
    } catch (error) {
        console.error(`[getCategoryByIdQuery-error]: Error fetching data from ${table} for ID ${id}`, error);
        throw new Error(`Failed to fetch data for ID ${id} from ${table}`);
    }
};

const deleteCategoryQuery = async (table, id) => {
    try {
        const query = `DELETE FROM \`${table}\` WHERE id_categoria = ?`;
        return await queryDatabase(query, [id]);
    } catch (error) {
        console.error(`[deleteCategoryQuery-error]: Error deleting category with ID ${id} from ${table}`, error);
        throw new Error(`Failed to delete category with ID ${id} from ${table}`);
    }
};

const createCategoryQuery = async (table, data) => {
    try {
        const query = `INSERT INTO \`${table}\` SET ?`;
        return await queryDatabase(query, [data]);
    } catch (error) {
        console.error(`[createCategoryQuery-error]: Error inserting category with data ${JSON.stringify(data)} into table ${table}`, error);
        throw new Error(`Failed to insert category with data ${JSON.stringify(data)} into table ${table}`);
    }
};

const updateCategoryQuery = async (table, data, id) => {
    try {
        const query = `UPDATE \`${table}\` SET ? WHERE id_categoria = ?`;
        return await queryDatabase(query, [data, id]);
    } catch (error) {
        console.error(`[updateCategoryQuery-error]: Error updating category with ID ${id} in table ${table}`, error);
        throw new Error(`Failed to update category with ID ${id} in table ${table}`);
    }
};

// Queries para Subcategorías

const getSubcategoriesQuery = async (table) => {
    try {
        const query = `SELECT * FROM \`${table}\``;
        return await queryDatabase(query);
    } catch (error) {
        console.error(`[getSubcategoriesQuery-error]: Error fetching data from ${table}`, error);
        throw new Error(`Failed to fetch data from ${table}`);
    }
};

const getSubcategoryByIdQuery = async (table, id) => {
    try {
        const query = `SELECT * FROM \`${table}\` WHERE id_subcategoria = ?`;
        return await queryDatabase(query, [id]);
    } catch (error) {
        console.error(`[getSubcategoryByIdQuery-error]: Error fetching data from ${table} for ID ${id}`, error);
        throw new Error(`Failed to fetch data for ID ${id} from ${table}`);
    }
};

const deleteSubcategoryQuery = async (table, id) => {
    try {
        const query = `DELETE FROM \`${table}\` WHERE id_subcategoria = ?`;
        return await queryDatabase(query, [id]);
    } catch (error) {
        console.error(`[deleteSubcategoryQuery-error]: Error deleting subcategory with ID ${id} from ${table}`, error);
        throw new Error(`Failed to delete subcategory with ID ${id} from ${table}`);
    }
};

const createSubcategoryQuery = async (table, data) => {
    try {
        const query = `INSERT INTO \`${table}\` SET ?`;
        return await queryDatabase(query, [data]);
    } catch (error) {
        console.error(`[createSubcategoryQuery-error]: Error inserting subcategory with data ${JSON.stringify(data)} into table ${table}`, error);
        throw new Error(`Failed to insert subcategory with data ${JSON.stringify(data)} into table ${table}`);
    }
};

const updateSubcategoryQuery = async (table, data, id) => {
    try {
        const query = `UPDATE \`${table}\` SET ? WHERE id_subcategoria = ?`;
        return await queryDatabase(query, [data, id]);
    } catch (error) {
        console.error(`[updateSubcategoryQuery-error]: Error updating subcategory with ID ${id} in table ${table}`, error);
        throw new Error(`Failed to update subcategory with ID ${id} in table ${table}`);
    }
};

export {
    getCategoriesQuery,
    getCategoryByIdQuery,
    createCategoryQuery,
    deleteCategoryQuery,
    updateCategoryQuery,
    getSubcategoriesQuery,
    getSubcategoryByIdQuery,
    createSubcategoryQuery,
    deleteSubcategoryQuery,
    updateSubcategoryQuery
};
