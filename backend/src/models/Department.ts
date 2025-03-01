import Sequelize, { DataTypes, Model, UUID } from 'sequelize';
import sequelize from '../config/db';
class Department extends Model {
    public id!: string;
    public name!: string;
}

Department.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAlpha: true,
            },
        },
    },
    { sequelize, tableName: 'departments', timestamps: false }
);

export default Department;
