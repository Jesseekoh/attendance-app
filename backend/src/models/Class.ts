import sequelize from '../config/db';
import { DataTypes } from 'sequelize';
import crypto from 'crypto';
import Teacher from './Teacher';
import Course from './Course';

const Class = sequelize.define('Class', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        defaultValue: () => crypto.randomBytes(16),
    },
    teacherId: {
        type: DataTypes.UUID,
        references: {
            model: Teacher,
            key: 'id',
        },
    },

    courseId: {
        type: DataTypes.UUID,
        references: {
            model: Course,
            key: 'id',
        },
    },
    location: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    startTime: {
        type: DataTypes.TIME,
    },

    endTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
});

export default Class;
