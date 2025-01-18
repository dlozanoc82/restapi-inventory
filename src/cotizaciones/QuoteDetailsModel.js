import { DataTypes } from 'sequelize';
import Cotizacion from './QuoteModel.js'; // Asumiendo que tienes un modelo Cotizacion
import Producto from '../productos/ProductModel.js';
import sequelize from '../../config/dbs.js';

const DetalleCotizacion = sequelize.define('DetalleCotizacion', {
    id_detalle: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_cotizacion: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Cotizacion,
            key: 'id_cotizacion',
        },
    },
    id_producto: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Producto,
            key: 'id_producto',
        },
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
}, {
    tableName: 'detalle_cotizaciones',
    timestamps: false,
});

Cotizacion.hasMany(DetalleCotizacion, { foreignKey: 'id_cotizacion' });
DetalleCotizacion.belongsTo(Cotizacion, { foreignKey: 'id_cotizacion' });

Producto.hasMany(DetalleCotizacion, { foreignKey: 'id_producto' });
DetalleCotizacion.belongsTo(Producto, { foreignKey: 'id_producto' });

export default DetalleCotizacion;
