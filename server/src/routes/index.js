import { Router } from 'express';

import accountRoutes from './accountRoutes.js';
import authRoutes from './authRoutes.js';
import campaignRoutes from './campaignRoutes.js';
import publicRoutes from './publicRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/account', accountRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/', publicRoutes);

export default router;
