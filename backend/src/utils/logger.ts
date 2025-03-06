import pino from 'pino';

const logger = pino({
    level: 'info',
    transport: {
        target: 'pino-pretty',
    },
    base: {
        pid: false,
    },
});

export default logger;
