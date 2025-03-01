import { config } from 'dotenv';
config();
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import { sequelize } from './models';
const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
});
app.use(cors({}));
app.use(limiter);
app.use(express.json());
app.use(cookieParser());

// test database connection
try {
    sequelize.authenticate();
    console.log('Connected successfully');
    sequelize
        .sync({ alter: true, force: true })
        .then(() => console.log('Created Tables successfully'))
        .catch((error) => console.log('Error creating tables: ', error));
} catch (error) {
    console.log('failed to connect to database: ', error);
}

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.listen(process.env.PORT, () => {
    console.log('Server listening on port', process.env.PORT);
});

const shutdown = async () => {
    console.log('Shutting Down...');
    try {
        await sequelize.close();
        console.log('Database closed.');
    } catch (error) {
        console.log('An error occured when closing the database: ', error);
    }
    process.exit(0);
};
process.on('SIGINT', shutdown);
