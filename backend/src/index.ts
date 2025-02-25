import express from 'express';
import { config } from 'dotenv';
import authRoutes from './routes/authRoutes';
import sequelize from './config/db';
config();
const app = express();

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
