import { Router } from 'express';

import { getAccount, updatePlan } from '../controllers/accountController.js';
import { requireAuth } from '../middleware/auth.js';
import { planUpdateValidators } from '../utils/validators.js';

const router = Router();

router.get('/', requireAuth, getAccount);
router.patch('/plan', requireAuth, planUpdateValidators, updatePlan);

export default router;
