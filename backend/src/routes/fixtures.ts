// backend/src/routes/fixtures.ts

import express, { Request, Response, Router } from 'express';
import * as footballAPI from '../lib/apiFootball';
import { withLock } from '../utils/withlock';
import  cache  from '../utils/cache';
const router: Router = express.Router();


// Get fixtures by date
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
    
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
      return;
    }
    
    const data = await footballAPI.getFixturesByDate(date);
    res.json(data);
  } catch (error) {
    console.error('Error in /fixtures route:', error);
    res.status(500).json({ 
      error: 'Failed to fetch fixtures',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get fixtures by date range
router.get('/range', async (req: Request, res: Response): Promise<void> => {
  try {
    const from = req.query.from as string;
    const to = req.query.to as string;
    
    if (!from || !to) {
      res.status(400).json({ error: 'Both from and to dates are required' });
      return;
    }
    
    const data = await footballAPI.getFixturesByDateRange(from, to);
    res.json(data);
  } catch (error) {
    console.error('Error in /fixtures/range route:', error);
    res.status(500).json({ 
      error: 'Failed to fetch fixtures',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});



// Get fixtures by league
router.get('/league/:leagueId', async (req: Request, res: Response): Promise<void> => {
  try {
    const leagueIdParam = req.params.leagueId;

    const leagueId = Array.isArray(leagueIdParam)
      ? parseInt(leagueIdParam[0], 10)
      : parseInt(leagueIdParam, 10);

    const season =
      typeof req.query.season === 'string'
        ? parseInt(req.query.season, 10)
        : new Date().getFullYear();
    
    if (isNaN(leagueId)) {
      res.status(400).json({ error: 'Invalid league ID' });
      return;
    }
    
    const data = await footballAPI.getFixturesByLeague(leagueId, season);
    res.json(data);
  } catch (error) {
    console.error('Error in /fixtures/league route:', error);
    res.status(500).json({ 
      error: 'Failed to fetch league fixtures',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;