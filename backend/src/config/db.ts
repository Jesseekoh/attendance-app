import { config } from 'dotenv';
config();
import { Sequelize } from 'sequelize';
import { PrismaClient } from '../../generated/prisma';

const DATABASE_URI = process.env.DATABASE_URI;

export const prisma = new PrismaClient();

if (!DATABASE_URI) {
  throw new Error('DATABASE_URI not defined in env file');
}

const sequelize = new Sequelize(DATABASE_URI);

export default sequelize;
