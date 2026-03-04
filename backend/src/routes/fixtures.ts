import { Router, Request, Response } from 'express';
import {
  getFixturesByDate,
  getFixturesByLeague,
  getFixturesByDateRange,
} from '../lib/apiFootball';

const router = Router();

/*
GET /api/fixtures?date=2026-03-03
*/
router.get('/', async (req: Request, res: Response) => {
  const { date, from, to, league } = req.query;

  try {
    // Single date
    if (date) {
      const data = await getFixturesByDate(date as string);
      return res.json(data);
    }

    // Date range
    if (from && to) {
      const data = await getFixturesByDateRange(
        from as string,
        to as string
      );
      return res.json(data);
    }

    // League (season auto resolved)
    if (league) {

      const data = await getFixturesByLeague(
        Number(league)
      );

      return res.json(data);
    }

    return res.status(400).json({
      message: 'Invalid query parameters',
    });
  } catch (error) {
    console.error('Fixtures route error:', error);

    return res.status(500).json({
      message: 'Failed to fetch fixtures',
    });
  }
});