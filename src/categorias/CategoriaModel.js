import { DataTypes } from 'sequelize';
import sequelize from '../../config/dbs.js';

const Categoria = sequelize.define('Categoria', {
    id_categoria: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nombre_categoria: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    descripcion_categoria: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
    },
    estado: {
        type: DataTypes.TINYINT(1),
        defaultValue: 1,
        allowNull: false,
    },
}, {
    tableName: 'categorias',
    timestamps: false, // No auto timestamps (createdAt, updatedAt)
});

export default Categoria;
  