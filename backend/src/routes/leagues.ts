// backend/src/routes/leagues.ts
import express, { Request, Response, Router } from 'express';
import * as footballAPI from '../lib/apiFootball';
const router: Router = express.Router();

router.get('/leagues', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await footballAPI.getLeagues();
    res.json(data);
    console.dir(data);
  } catch (error) {
    console.error('Error in /leagues route:', error);
    res.status(500).json({ 
      error: 'Failed to fetch leagues',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});
export default router;