import { DataTypes } from 'sequelize';
import sequelize from '../../config/dbs.js';

const Producto = sequelize.define('Producto', {
    id_producto: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre_producto: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    descripcion_producto: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    imagen_producto: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    precio_producto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: true,
    },
    estado: {
        type: DataTypes.TINYINT(1),
        defaultValue: 1,
        allowNull: true,
    },
}, {
    tableName: 'productos',
    timestamps: false,
});

export default Producto;
