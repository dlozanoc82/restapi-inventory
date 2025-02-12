import { DataTypes } from 'sequelize';
import sequelize from '../../config/dbs.js';


const Cliente = sequelize.define('Cliente', {
    id_cliente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nombre_cliente: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    apellido_cliente: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    documento_cliente: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
    },
    correo_cliente: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    celular_cliente: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    direccion_cliente: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    fecha_registro: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
    },
    estado: {
        type: DataTypes.TINYINT(1),
        defaultValue: 1,
        allowNull: false,
    },
}, {
    tableName: 'clientes',
    timestamps: false, // No auto timestamps (createdAt, updatedAt)
});


export default Cliente;