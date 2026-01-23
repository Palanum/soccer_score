import { Router } from 'express';
import fixturesRoutes from './fixtures';
import leaguesRoutes from './leagues';
import homeRoutes from './home';

const router = Router();

router.use('/fixtures', fixturesRoutes);
router.use('/leagues', leaguesRoutes);
router.use('/home', homeRoutes);

export default router;
