// live and Today
import { Router, Request, Response } from 'express';
import { apiFootball } from '../lib/apiFootball';
import { asyncHandler } from '../middlewares/asyncHandler';
import { isLiveMatch } from '../utils/isLive';
import { Fixture } from '../types/type';
import { mapFixture } from '../utils/mapingType';
const router = Router();

/**
 * GET /api/fixtures
 * Query params (optional):
 * - league: number
 * - season: number
 * - date: YYYY-MM-DD
 * - live: true | false
 * - team: number
 */

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { league, season, date, live, team } = req.query;

    const params: Record<string, any> = {};

    if (league) params.league = league;
    if (season) params.season = season;
    if (date) params.date = date;
    if (team) params.team = team;

    // live=true → API-Football uses "live=all"
    if (live === 'true') {
      params.live = 'all';
    }

    const { data } = await apiFootball.get('/fixtures', { params });

    
const fixtures: Fixture[] = data.response.map(mapFixture);

    res.json({
      count: fixtures.length,
      fixtures,
    });
  })
);

export default router;
