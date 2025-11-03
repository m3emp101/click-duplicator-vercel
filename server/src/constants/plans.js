export const PLAN_TYPES = {
  FREE: 'free',
  STANDARD: 'standard',
  PRO: 'pro',
  UNLIMITED: 'unlimited',
};

export const PLAN_LIMITS = {
  [PLAN_TYPES.FREE]: 1,
  [PLAN_TYPES.STANDARD]: 5,
  [PLAN_TYPES.PRO]: 10,
  [PLAN_TYPES.UNLIMITED]: Infinity,
};

export const PLAN_UPGRADE_URLS = {
  [PLAN_TYPES.FREE]: 'https://example.com/upgrade/standard',
  [PLAN_TYPES.STANDARD]: 'https://example.com/upgrade/pro',
  [PLAN_TYPES.PRO]: 'https://example.com/upgrade/unlimited',
  [PLAN_TYPES.UNLIMITED]: 'https://example.com/account/manage',
};

export const getPlanLimit = (plan) => PLAN_LIMITS[plan] ?? PLAN_LIMITS[PLAN_TYPES.FREE];

export const isUnlimitedPlan = (plan) => getPlanLimit(plan) === Infinity;

export const getUpgradeUrl = (plan) => PLAN_UPGRADE_URLS[plan] ?? PLAN_UPGRADE_URLS[PLAN_TYPES.FREE];
