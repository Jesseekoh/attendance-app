import crypto from 'crypto';
import { DataTypes } from 'sequelize';
import sequelize from '../config/db';

const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.BLOB,
        primaryKey: true,
        unique: true,
        defaultValue: () => crypto.randomBytes(16),
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
});

export default Course;
