import { Router, Request, Response } from 'express';
import { getLeagues } from '../lib/apiFootball';

const router = Router();

// GET /api/leagues
router.get('/', async (_req: Request, res: Response) => {
  try {
    const data = await getLeagues();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch leagues',
    });
  }
});

export default router;