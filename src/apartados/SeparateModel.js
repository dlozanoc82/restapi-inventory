import { DataTypes } from 'sequelize';
import Cliente from '../clientes/ClientsModel.js'; // Asumiendo que tienes un modelo Cliente
import Usuario from '../usuarios/UsersModel.js';// Asumiendo que tienes un modelo Usuario
import sequelize from '../../config/dbs.js';

const Apartado = sequelize.define('Apartado', {
    id_apartado: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fecha_apartado: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    estado_apartado: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
        allowNull: true,
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
}, {
    tableName: 'apartados',
    timestamps: false,
});

Cliente.hasMany(Apartado, { foreignKey: 'id_cliente' });
Apartado.belongsTo(Cliente, { foreignKey: 'id_cliente' });

Usuario.hasMany(Apartado, { foreignKey: 'id_usuario' });
Apartado.belongsTo(Usuario, { foreignKey: 'id_usuario' });

export default Apartado;
