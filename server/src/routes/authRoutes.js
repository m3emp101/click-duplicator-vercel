import { Router } from 'express';

import { login, logout, me, register } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { loginValidators, registerValidators } from '../utils/validators.js';

const router = Router();

router.post('/register', registerValidators, register);
router.post('/login', loginValidators, login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, me);

export default router;
