import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { findNextUpcomingFixtures } from '../utils/findNextUpcomingFixtures';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const data = await findNextUpcomingFixtures();
    res.json(data);
  })
);

export default router;
