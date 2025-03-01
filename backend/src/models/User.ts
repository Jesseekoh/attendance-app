import crypto from 'crypto';
import Sequelize from 'sequelize';
import { DataTypes, Model, StringDataType } from 'sequelize';
import sequelize from '../config/db';

class User extends Model {
    public id!: string;
    public firstname!: string;
    public lastName!: string;
    public email!: string;
    public role!: string;
    public passwordHash!: string;
}
User.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAlpha: true,
            },
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAlpha: true,
            },
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
    { tableName: 'users', sequelize }
);

export default User;
