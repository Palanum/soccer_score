// backend/src/routes/live.ts
import express, { Request, Response, Router } from 'express';
import * as footballAPI from '../lib/apiFootball';
import { withLock } from '../utils/withlock';
import  cache  from '../utils/cache';
const router: Router = express.Router();

router.get('/live', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await withLock('live_matches', () =>
      footballAPI.getLiveMatches()
    );
    res.json(data);
  } catch (error) {
    console.error('Error in /live route:', error);
    res.status(500).json({ 
      error: 'Failed to fetch live matches',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});
export default router;