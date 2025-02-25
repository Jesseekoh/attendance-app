import crypto from 'crypto';
import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/db';
const Student = sequelize.define(
    'Student',
    {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        matricNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        id: {
            type: DataTypes.BLOB,
            primaryKey: true,
            defaultValue: () => crypto.randomBytes(16),
        },
    },
    { tableName: 'students' }
);

export default Student;
