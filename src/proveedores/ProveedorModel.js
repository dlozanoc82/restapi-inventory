import { DataTypes } from 'sequelize';
import sequelize from '../../config/dbs.js';

const Proveedor = sequelize.define('Proveedor', {
    id_proveedor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nombre_proveedor: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    celular_proveedor: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    correo_proveedor: {
        type: DataTypes.STRING(255),
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
    tableName: 'proveedores',
    timestamps: false, // No auto timestamps (createdAt, updatedAt)
});

export default Proveedor;