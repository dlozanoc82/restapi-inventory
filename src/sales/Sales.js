import { DataTypes } from 'sequelize';
import sequelize from '../../config/dbs.js';
import Cliente from '../clientes/ClientsModel.js';
import Usuario from '../usuarios/UsersModel.js';
import MedioDePago from '../medios_pago/MeansPaymentModel.js';

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
        references:{
            model: Cliente,
            key: 'id_cliente'
        }
    },
    id_mdspago: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: MedioDePago,
            key: 'id_mdspago'
        }
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: Usuario,
            key: 'id_usuario'
        }
    },
}, {
    tableName: 'ventas',
    timestamps: false, // Evita columnas automáticas (createdAt, updatedAt)
});

// Un cliente puede tener muchas ventas
Cliente.hasMany(Sale, {
    foreignKey: 'id_cliente'
});

// Una venta pertenece a un solo cliente
Sale.belongsTo(Cliente, {
    foreignKey: 'id_cliente',
    as: 'cliente'
});

// Un vendedor puede tener muchas ventas
Usuario.hasMany(Sale, {
    foreignKey: 'id_usuario'
})

// Una venta pertenece a un solo vendedor
Sale.belongsTo(Usuario, {
    foreignKey: 'id_usuario',
    as: 'vendedor'
})

// Un medio de pago puede tener muchas ventas
MedioDePago.hasMany(Sale, {
    foreignKey: 'id_mdspago'
})

// Una venta pertenece a un solo medio de pago
Sale.belongsTo(MedioDePago, {
    foreignKey: 'id_mdspago',
    as: 'medio_pago'
})


export default Sale;
