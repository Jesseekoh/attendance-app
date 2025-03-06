import { config } from 'dotenv';
config();
import express from 'express';
import pinoHttp from 'pino-http';
import { rateLimit } from 'express-rate-limit';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import studentRoutes from './routes/studentRoutes';
import teacherRoutes from './routes/teacherRoutes';
import { sequelize } from './models';
import logger from './utils/logger';

const app = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
});
app.use(pinoHttp({ logger }));
app.use(cors({ credentials: true }));
app.use(limiter);
app.use(express.json());
app.use(cookieParser());

// test database connection
try {
    sequelize.authenticate();
    logger.info('Database connected successfully');
    sequelize
        .sync({ alter: true })
        .then(() => logger.info('Created Tables successfully'))
        .catch((error) => logger.error('Error creating tables: ', error));
} catch (error) {
    logger.error('failed to connect to database: ', error);
}

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/teachers', teacherRoutes);
app.use('/api/v1/students', studentRoutes);
app.listen(process.env.PORT, () => {
    logger.info(`Server is listening on port ${process.env.PORT}`);
});

const shutdown = async () => {
    logger.info('Shutting Down...');
    try {
        await sequelize.close();
        logger.info('Database closed.');
    } catch (error) {
        logger.info('An error occured when closing the database: ', error);
    }
    process.exit(0);
};
process.on('SIGINT', shutdown);
