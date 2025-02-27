import { DataTypes } from 'sequelize';
import sequelize from '../config/db';
import Course from './Course';
import Student from './Student';

const Enrollment = sequelize.define(
    'Enrollment',
    {
        CourseId: {
            type: DataTypes.BLOB,
            allowNull: false,
            references: {
                model: Course,
                key: 'id',
            },
        },
        StudentId: {
            type: DataTypes.BLOB,
            allowNull: false,
            references: {
                model: Student,
                key: 'id',
            },
        },
        grade: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 0,
                max: 100,
            },
        },
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['StudentId', 'CourseId'],
            },
        ],
    }
);

export default Enrollment;
