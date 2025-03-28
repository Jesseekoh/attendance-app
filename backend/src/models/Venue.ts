import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import Sequelize from 'sequelize';
class Venue extends Model {
    public id!: string;
    public latitude!: number;
    public longitude!: number;
}

Venue.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: false,
        },
        longitude: {
            type: DataTypes.DECIMAL(10, 8),
        },
    },
    {
        sequelize,
        timestamps: false,
        tableName: 'venues',
        indexes: [
            {
                unique: true,
                fields: ['latitude', 'longitude'],
            },
        ],
    }
);

export default Venue;
