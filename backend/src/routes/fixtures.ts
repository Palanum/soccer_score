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
  asyncHandler(async (req, res) => {
    const { league, season, date, live, team } = req.query;

    const params: Record<string, any> = {};

    if (league) params.league = Number(league);
    if (season) params.season = Number(season);
    if (team) params.team = Number(team);
    if (date) params.date = String(date);

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
