import crypto from 'crypto';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import Sequelize from 'sequelize';

class Course extends Model {
    public id!: string;
    public code!: string;
    public title!: string;
    public desc!: string;
}
Course.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            unique: true,
            defaultValue: Sequelize.UUIDV4,
        },
        code: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },

        desc: {
            type: DataTypes.TEXT,
        },
    },
    { timestamps: false, sequelize }
);

export default Course;
