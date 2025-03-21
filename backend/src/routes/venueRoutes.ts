import { Router, Request, Response } from 'express';
import { Venue } from '../models';
import logger from '../utils/logger';

const router = Router();

async function getAllVenues(req: Request, res: Response) {
    try {
        const venues = await Venue.findAll();

        res.status(200).json({
            data: venues,
            message: 'Venues retrieved successfully',
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
}

router.get('/', getAllVenues);

export default router;
