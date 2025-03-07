import { DataTypes } from 'sequelize';
import Producto from '../productos/ProductModel.js';
import Proveedor from '../proveedores/ProveedorModel.js';
import sequelize from '../../config/dbs.js';

const Adquisicion = sequelize.define('Adquisicion', {
    id_adquisicion: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fecha_adquisicion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        // Sequelize does not support computed columns directly, but you can manage this in queries or with hooks.
    },
    precio_venta: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    id_producto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Producto,
            key: 'id_producto',
        },
    },
    id_proveedor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Proveedor,
            key: 'id_proveedor',
        },
    },
}, {
    tableName: 'adquisiciones',
    timestamps: false,
});

Producto.hasMany(Adquisicion, { foreignKey: 'id_producto' });
Adquisicion.belongsTo(Producto, { as: 'producto', foreignKey: 'id_producto' });

Proveedor.hasMany(Adquisicion, { foreignKey: 'id_proveedor' });
Adquisicion.belongsTo(Proveedor, { as: 'proveedor', foreignKey: 'id_proveedor' });

export default Adquisicion;
