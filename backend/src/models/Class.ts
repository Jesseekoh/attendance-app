import sequelize from '../config/db';
import { DataTypes, Model } from 'sequelize';
import Sequelize from 'sequelize';
import Teacher from './Teacher';
import Course from './Course';
import Venue from './Venue';

class Class extends Model {
    public id!: string;
    public teacherId!: string;
    public courseId!: string;
    public venueId!: string;
    public startTime!: string;
    public endTime!: string;
}
Class.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            unique: true,
            defaultValue: Sequelize.UUIDV4,
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
        venueId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Venue,
                key: 'id',
            },
        },

        startTime: {
            type: DataTypes.DATE,
        },

        endTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        indexes: [
            {
                unique: true,
                fields: ['startTime', 'endTime', 'venueId', 'courseId'],
            },
        ],
    }
);

export default Class;
