import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('inventario_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // Desactiva logs de SQL
});

export default sequelize;
