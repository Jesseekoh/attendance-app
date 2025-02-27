import sequelize from '../config/db';
import { DataTypes } from 'sequelize';
import crypto from 'crypto';
import Teacher from './Teacher';

const Class = sequelize.define('Class', {
    id: {
        type: DataTypes.BLOB,
        primaryKey: true,
        unique: true,
        defaultValue: () => crypto.randomBytes(16),
    },
    teacherId: {
        type: DataTypes.BLOB,
        references: {
            model: Teacher,
            key: 'id',
        },
    },
    location: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    start_time: {
        type: DataTypes.TIME,
    },

    end_time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
});

export default Class;
