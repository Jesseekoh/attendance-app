import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { config } from 'dotenv';
import authRoutes from './routes/authRoutes';
import sequelize from './config/db';
config();
const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
});

app.use(limiter);

try {
    sequelize.authenticate();
    console.log('Connected successfully');
    sequelize
        .sync({ force: true })
        .then(() => console.log('Created Tables successfully'))
        .catch((error) => console.log('Error creating tables: ', error));
} catch (error) {
    console.log('failed to connect to database: ', error);
}

app.use(express.json());

app.use('/auth', authRoutes);

app.listen(process.env.PORT, () => {
    console.log('Server listening on port', process.env.PORT);
});

process.on('SIGINT', () => {
    console.log('Server is shutting down');
    sequelize
        .close()
        .then(() => {
            console.log('Database closed.');
        })
        .catch((error) => {
            console.log('Error closing Database');
        })
        .finally(() => {
            process.exit(0);
        });
});
