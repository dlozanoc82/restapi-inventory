import { DataTypes } from 'sequelize';
import sequelize from '../../config/dbs.js';

const Sale = sequelize.define('Sale', {
    id_venta: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fecha_venta: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    id_cliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_mdspago: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_vendedor: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'ventas',
    timestamps: false, // Evita columnas automáticas (createdAt, updatedAt)
});

export default Sale;
