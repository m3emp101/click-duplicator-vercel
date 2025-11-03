import { validationResult } from 'express-validator';

import { getPlanLimit, getUpgradeUrl } from '../constants/plans.js';
import { User } from '../models/User.js';
import { clearAuthCookie, setAuthCookie } from '../utils/cookies.js';
import { signAuthToken } from '../utils/tokens.js';

const buildUserResponse = (user) => {
  const planLimitValue = getPlanLimit(user.plan);

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    plan: user.plan,
    planLimit: Number.isFinite(planLimitValue) ? planLimitValue : null,
    isUnlimitedPlan: !Number.isFinite(planLimitValue),
    upgradeUrl: getUpgradeUrl(user.plan),
  };
};

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    const token = signAuthToken(user);
    setAuthCookie(res, token);

    return res.status(201).json({ user: buildUserResponse(user) });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signAuthToken(user);
    setAuthCookie(res, token);

    return res.json({ user: buildUserResponse(user) });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (_req, res) => {
  clearAuthCookie(res);
  return res.json({ message: 'Logged out' });
};

export const me = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  return res.json({ user: buildUserResponse(req.user) });
};
