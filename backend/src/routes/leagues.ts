import { Router } from 'express';
import { apiFootball } from '../lib/apiFootball';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

/**
 * GET /api/leagues
 * ?season=
 */
// router.get(
//   '/',
//   asyncHandler(async (req, res) => {
//     const { season } = req.query;

//     const response = await apiFootball.get('/leagues', {
//       params: { season },
//     });

//     res.json(response.data);
//   })
// );

// export default router;
