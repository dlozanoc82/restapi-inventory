import { DataTypes } from 'sequelize';
import Usuario from '../usuarios/UsersModel.js';
import sequelize from '../../config/dbs.js';

const UsuarioLog = sequelize.define('UsuarioLog', {
    id_log: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id_usuario',
        },
    },
    login_time: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
    },
    logout_time: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'usuario_logs',
    timestamps: false,
});

Usuario.hasMany(UsuarioLog, { foreignKey: 'id_usuario' });
UsuarioLog.belongsTo(Usuario, { foreignKey: 'id_usuario' });

export default UsuarioLog;
