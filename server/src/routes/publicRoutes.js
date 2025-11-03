import { Router } from 'express';

import { renderCampaignBySlug } from '../controllers/publicController.js';

const router = Router();

router.get('/c/:slug', renderCampaignBySlug);

export default router;
