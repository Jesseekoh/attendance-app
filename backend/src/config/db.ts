import { Sequelize } from 'sequelize';

const DATABASE_URI = process.env.DATABASE_URI;

if (!DATABASE_URI) {
    throw new Error('DATABASE_URI not defined in env file');
}

const sequelize = new Sequelize(DATABASE_URI);

export default sequelize;
