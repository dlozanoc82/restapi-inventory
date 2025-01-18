import { DataTypes } from 'sequelize';
import Producto from './Producto.js';
import Proveedor from './Proveedor.js';
import sequelize from '../../config/dbs.js';

const Adquisicion = sequelize.define('Adquisicion', {
    id_adquisicion: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fecha_adquisicion: {
        type: DataTypes.TIMESTAMP,
        allowNull: false,
        defaultValue: DataTypes.NOW,
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
Adquisicion.belongsTo(Producto, { foreignKey: 'id_producto' });

Proveedor.hasMany(Adquisicion, { foreignKey: 'id_proveedor' });
Adquisicion.belongsTo(Proveedor, { foreignKey: 'id_proveedor' });

export default Adquisicion;
