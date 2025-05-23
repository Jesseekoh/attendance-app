import { config } from 'dotenv';
config();
import express from 'express';
import pinoHttp from 'pino-http';
import { rateLimit } from 'express-rate-limit';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {
  authRoutes,
  classRoutes,
  courseRoutes,
  studentRoutes,
  teacherRoutes,
  userRoutes,
  venueRoutes,
} from './routes';
import { sequelize } from './models';
import logger from './utils/logger';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Attendance app',
      version: '1.0.0',
    },
    components: {
      schemas: {
        Class: {
          type: 'object',
          properties: {
            courseId: {
              type: 'string',
              description: 'The ID of the course the class is for',
            },
            venueId: {
              type: 'string',
              description: 'The ID of the venue where the class is to be held',
            },
            startTime: {
              type: 'string',
              format: 'date-time',
              description: 'When the class is to start',
            },
            endTime: {
              type: 'string',
              format: 'date-time',
              description: 'When the class is to end',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
  servers: [
    { url: 'http://localhost:5000/api', description: 'Development server' },
  ],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(pinoHttp({ logger }));
app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:5173',
      'http://192.168.0.2:5173',
      'https://attendance-app-frontend-09ja.onrender.com',
    ],
  })
);
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
app.use('/api/v1/classes', classRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/teachers', teacherRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/venues', venueRoutes);
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
