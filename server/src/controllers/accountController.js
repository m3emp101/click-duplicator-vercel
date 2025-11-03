import { validationResult } from 'express-validator';

import { getPlanLimit, getUpgradeUrl, PLAN_TYPES } from '../constants/plans.js';

const serializeAccount = (user) => {
  const planLimitValue = getPlanLimit(user.plan);

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    plan: user.plan,
    planLimit: Number.isFinite(planLimitValue) ? planLimitValue : null,
    isUnlimitedPlan: !Number.isFinite(planLimitValue),
    upgradeUrl: getUpgradeUrl(user.plan),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const getAccount = async (req, res) => {
  return res.json({ account: serializeAccount(req.user) });
};

export const updatePlan = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { plan } = req.body;

    if (!Object.values(PLAN_TYPES).includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    req.user.plan = plan;
    await req.user.save();

    return res.json({ account: serializeAccount(req.user) });
  } catch (error) {
    return next(error);
  }
};
