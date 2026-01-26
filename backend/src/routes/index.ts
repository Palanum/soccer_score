import { Router } from 'express';
import fixturesRoutes from './fixtures';
import leaguesRoutes from './leagues';
import live from './live';

const router = Router();

router.use('/fixtures', fixturesRoutes);
router.use('/leagues', leaguesRoutes);
router.use('/live', live);

export default router;
