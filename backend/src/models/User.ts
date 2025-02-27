import crypto from 'crypto';
import { DataTypes } from 'sequelize';
import sequelize from '../config/db';
const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.BLOB,
            primaryKey: true,
            defaultValue: () => crypto.randomBytes(16),
        },
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
            validate: {
                isEmail: true,
            },
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: {
                    args: [['student', 'teacher']],
                    msg: 'Role must be either student or teacher',
                },
            },
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { tableName: 'users' }
);

export default User;
