import { DataTypes } from 'sequelize';
import sequelize from '../../config/dbs.js';

const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nombre_usuario: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    apellido_usuario: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true, // Email debe ser único
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    rol_usuario: {
        type: DataTypes.ENUM('admin', 'user'),
        allowNull: false,
    },
    fecha_creacion: {
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
    tableName: 'usuarios',
    timestamps: false, // No auto timestamps (createdAt, updatedAt)
});

export default Usuario;