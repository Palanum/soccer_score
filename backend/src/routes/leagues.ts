import { Router } from 'express';
import { apiFootball } from '../lib/apiFootball';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

/**
 * GET /api/leagues
 * ?season=
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const response = await apiFootball.get("/leagues", {
      params: { current: true },
    });

    const data = response.data.response;

    const leagues = data.map((l: any) => ({
      id: l.league.id,
      name: l.league.name,
      type: l.league.type, // League | Cup | Playoff
      country: l.country.name,
      logo: l.league.logo,
    }));

    res.json(leagues);
  })
);

export default router;
