import sequelize from '../config/db';
import { DataTypes } from 'sequelize';
import Sequelize from 'sequelize';
import Teacher from './Teacher';
import Course from './Course';
import Venue from './Venue';

const Class = sequelize.define('Class', {
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
        type: DataTypes.TIME,
    },

    endTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
});

export default Class;
