import crypto from 'crypto';
import sequelize from '../config/db';
import { DataTypes } from 'sequelize';
import User from './User';

const Teacher = sequelize.define(
    'Teacher',
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: User,
                key: 'id',
            },
        },
        department: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { timestamps: false }
);

export default Teacher;
