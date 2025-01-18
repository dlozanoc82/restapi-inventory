import { DataTypes } from 'sequelize';
import sequelize from '../../config/dbs.js';
import Usuario from '../usuarios/UsersModel.js';

const RefreshToken = sequelize.define('RefreshToken', {
    id_restokens: {
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
    token: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
    },
}, {
    tableName: 'refresh_tokens',
    timestamps: false,
});

Usuario.hasMany(RefreshToken, { foreignKey: 'id_usuario' });
RefreshToken.belongsTo(Usuario, { foreignKey: 'id_usuario' });

export default RefreshToken;
