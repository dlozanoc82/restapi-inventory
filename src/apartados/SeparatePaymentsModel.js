import { DataTypes } from 'sequelize';
import Apartado from './SeparateModel.js';
import MedioDePago from '../medios_pago/MeansPaymentModel.js';
import sequelize from '../../config/dbs.js';

const AbonoApartado = sequelize.define('AbonoApartado', {
    id_abono: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fecha_abono: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
    },
    monto_abono: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    id_apartado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Apartado,
            key: 'id_apartado',
        },
    },
    id_mdspago: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: MedioDePago,
            key: 'id_mdspago',
        },
    },
}, {
    tableName: 'abono_apartados',
    timestamps: false,
});

Apartado.hasMany(AbonoApartado, { foreignKey: 'id_apartado' });
AbonoApartado.belongsTo(Apartado, { foreignKey: 'id_apartado' });

MedioDePago.hasMany(AbonoApartado, { foreignKey: 'id_mdspago' });
AbonoApartado.belongsTo(MedioDePago, { foreignKey: 'id_mdspago' });

export default AbonoApartado;
