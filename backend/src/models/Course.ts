import crypto from 'crypto';
import { DataTypes } from 'sequelize';
import sequelize from '../config/db';
import Sequelize from 'sequelize';
const Course = sequelize.define('Course', {
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
});

export default Course;
