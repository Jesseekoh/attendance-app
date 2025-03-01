import sequelize from '../config/db';
import { DataTypes, Model } from 'sequelize';
import User from './User';

class Student extends Model {
    public id!: string;
    public matricNumber!: string;
    public level!: 100 | 200 | 300 | 400 | 500;
    public department!: string;
}
Student.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: User,
                key: 'id',
            },
        },
        matricNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        level: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            validate: {
                isIn: {
                    args: [[100, 200, 300, 400, 500]],
                    msg: 'Invalid level',
                },
            },
        },
        department: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { sequelize }
);

export default Student;
