import { DataTypes } from 'sequelize';
import Sale from './Sales.js';
import sequelize from '../../config/dbs.js';
import Producto from '../productos/ProductModel.js';

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
        references: {
            model: Producto,
            key: 'id_producto',
        },
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


// Una venta tiene muchos detalles
Sale.hasMany(SaleDetail, { as:'sale_details', foreignKey: 'id_venta' });
SaleDetail.belongsTo(Sale, { foreignKey: 'id_venta' });


// Un detalle de venta pertenece a un solo producto
Producto.hasMany(SaleDetail, { foreignKey: 'id_producto' });
SaleDetail.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });


export default SaleDetail;
