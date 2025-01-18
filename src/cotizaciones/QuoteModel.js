import { DataTypes } from 'sequelize';
import Cliente from '../clientes/ClientsModel.js';
import sequelize from '../../config/dbs.js';

const Cotizacion = sequelize.define('Cotizacion', {
    id_cotizacion: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fecha_cotizacion: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    },
    id_cliente: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Cliente,
            key: 'id_cliente',
        },
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    estado: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 1,
    },
}, {
    tableName: 'cotizaciones',
    timestamps: false,
});

Cliente.hasMany(Cotizacion, { foreignKey: 'id_cliente' });
Cotizacion.belongsTo(Cliente, { foreignKey: 'id_cliente' });

export default Cotizacion;
