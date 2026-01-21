import { Router } from 'express';
import { apiFootball } from '../lib/apiFootball';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

/**
 * GET /api/teams
 * ?search=
 * ?league=
 * ?season=
 */
// router.get(
//   '/',
//   asyncHandler(async (req, res) => {
//     const { search, league, season } = req.query;

//     const response = await apiFootball.get('/teams', {
//       params: { search, league, season },
//     });

//     res.json(response.data);
//   })
// );

export default router;
