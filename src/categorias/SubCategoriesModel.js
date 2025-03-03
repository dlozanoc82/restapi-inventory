import { DataTypes } from 'sequelize';
import sequelize from '../../config/dbs.js';
import Categoria from './CategoriaModel.js';

const Subcategoria = sequelize.define('Subcategoria', {
    id_subcategoria: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre_subcategoria: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    descripcion_subcategoria: {
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
    id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Categoria,
            key: 'id_categoria',
        },
    },
}, {
    tableName: 'subcategorias',
    timestamps: false,
});

Categoria.hasMany(Subcategoria, { foreignKey: 'id_categoria' });
Subcategoria.belongsTo(Categoria, { foreignKey: 'id_categoria', as: "categoria" });

export default Subcategoria;
