import { DataTypes } from 'sequelize';
import Cliente from '../clientes/ClientsModel.js';
import sequelize from '../../config/dbs.js';
import Usuario from '../usuarios/UsersModel.js';

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
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Usuario,
            key: 'id_usuario',
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
Cotizacion.belongsTo(Cliente, { as: 'cliente', foreignKey: 'id_cliente' });

Usuario.hasMany(Cotizacion, { foreignKey: 'id_usuario' });
Cotizacion.belongsTo(Usuario, { as: 'vendedor', foreignKey: 'id_usuario' });

export default Cotizacion;
