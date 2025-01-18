import { DataTypes } from 'sequelize';
import sequelize from '../../config/dbs.js';

const MedioDePago = sequelize.define('MedioDePago', {
    id_mdspago: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre_mdspagos: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    estado: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 1,
    },
}, {
    tableName: 'medios_de_pago',
    timestamps: false,
});

export default MedioDePago;
