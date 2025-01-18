import { DataTypes } from 'sequelize';
import Apartado from './SeparateModel.js'; // Asumiendo que tienes un modelo Apartado
import Producto from '../productos/ProductModel.js'; // Asumiendo que tienes un modelo Producto
import sequelize from '../../config/dbs.js';

const DetalleApartado = sequelize.define('DetalleApartado', {
    id_detalle: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_apartado: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Apartado,
            key: 'id_apartado',
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
    tableName: 'detalle_apartado',
    timestamps: false,
});

Apartado.hasMany(DetalleApartado, { foreignKey: 'id_apartado' });
DetalleApartado.belongsTo(Apartado, { foreignKey: 'id_apartado' });

Producto.hasMany(DetalleApartado, { foreignKey: 'id_producto' });
DetalleApartado.belongsTo(Producto, { foreignKey: 'id_producto' });

export default DetalleApartado;
