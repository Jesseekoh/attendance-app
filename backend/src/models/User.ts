import crypto from 'crypto';
import { BlobDataType, DataTypes, Model, StringDataType } from 'sequelize';
import sequelize from '../config/db';

class User extends Model {
    public id!: BlobDataType;
    public firstname!: string;
    public lastName!: string;
    public email!: string;
    public role!: string;
    public passwordHash!: string;
}
User.init(
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
    { tableName: 'users', sequelize }
);

export default User;
