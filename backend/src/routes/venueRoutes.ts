import { Router, Request, Response } from 'express';
import logger from '../utils/logger';
import { prisma } from '../config/db';

const router = Router();

async function getAllVenues(req: Request, res: Response) {
  try {
    const venues = await prisma.venue.findMany();

    res.status(200).json({
      success: true,
      data: venues,
      message: 'Venues retrieved successfully',
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
}

router.get('/', getAllVenues);

export default router;
