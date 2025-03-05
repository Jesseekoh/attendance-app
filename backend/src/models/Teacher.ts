import sequelize from '../config/db';
import { DataTypes, Model } from 'sequelize';
import User from './User';
import Course from './Course';

class Teacher extends Model {
    public id!: string;
    public department!: string;
    public Courses!: Course[];
}
Teacher.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: User,
                key: 'id',
            },
        },
        department: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { timestamps: false, sequelize }
);

export default Teacher;
