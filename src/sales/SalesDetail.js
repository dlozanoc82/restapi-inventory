import { DataTypes } from 'sequelize';
import Sale from './Sales.js';
import sequelize from '../../config/dbs.js';

const SaleDetail = sequelize.define('SaleDetail', {
    id_detalle: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_venta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Sale,
            key: 'id_venta',
        },
    },
    id_producto: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    tableName: 'detalle_ventas',
    timestamps: false,
});

Sale.hasMany(SaleDetail, { foreignKey: 'id_venta' });
SaleDetail.belongsTo(Sale, { foreignKey: 'id_venta' });

export default SaleDetail;
