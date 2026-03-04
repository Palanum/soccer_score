import { Router, Request, Response } from 'express';
import { getLiveMatches } from '../lib/apiFootball';

const router = Router();

// GET /api/live
router.get('/', async (_req: Request, res: Response) => {
  try {
    const data = await getLiveMatches();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch live matches',
    });
  }
});

export default router;