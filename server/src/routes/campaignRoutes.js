import { Router } from 'express';

import {
  cloneCampaign,
  createCampaign,
  deleteCampaign,
  findBySlug,
  getCampaign,
  listCampaigns,
  updateCampaign,
} from '../controllers/campaignController.js';
import { requireAuth } from '../middleware/auth.js';
import {
  campaignCreateValidators,
  campaignIdParamValidator,
  campaignSlugValidator,
  campaignUpdateValidators,
} from '../utils/validators.js';

const router = Router();

router.get('/', requireAuth, listCampaigns);
router.post('/', requireAuth, campaignCreateValidators, createCampaign);
router.get('/slug/:slug', campaignSlugValidator, findBySlug);
router.get('/:id', requireAuth, campaignIdParamValidator, getCampaign);
router.patch('/:id', requireAuth, campaignUpdateValidators, updateCampaign);
router.delete('/:id', requireAuth, campaignIdParamValidator, deleteCampaign);
router.post('/:id/clone', requireAuth, campaignIdParamValidator, cloneCampaign);

export default router;
