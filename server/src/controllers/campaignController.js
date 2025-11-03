import slugify from 'slugify';
import { validationResult } from 'express-validator';

import { getPlanLimit, isUnlimitedPlan } from '../constants/plans.js';
import { Campaign } from '../models/Campaign.js';

const serialiseCampaign = (campaign) => ({
  id: campaign._id,
  name: campaign.name,
  slug: campaign.slug,
  pageTitle: campaign.pageTitle,
  squeezePageUrl: campaign.squeezePageUrl,
  delayPopupUrl: campaign.delayPopupUrl,
  delayPopupDelaySeconds: campaign.delayPopupDelaySeconds,
  delayPopupCloseUrl: campaign.delayPopupCloseUrl,
  exitPopupUrl: campaign.exitPopupUrl,
  exitPopupCloseUrl: campaign.exitPopupCloseUrl,
  backgroundColor: campaign.backgroundColor,
  createdAt: campaign.createdAt,
  updatedAt: campaign.updatedAt,
});

const normaliseSlug = (name, slugInput) => {
  const source = slugInput || name;
  const slug = slugify(source, { lower: true, strict: true });
  if (!slug) {
    throw Object.assign(new Error('Unable to generate slug. Provide a valid slug.'), { statusCode: 400 });
  }
  return slug;
};

const ensureCampaignQuota = async (userId, plan) => {
  if (isUnlimitedPlan(plan)) {
    return;
  }

  const currentCount = await Campaign.countDocuments({ owner: userId });
  if (currentCount >= getPlanLimit(plan)) {
    const error = new Error(`Campaign limit reached for ${plan} plan. Upgrade to create more campaigns.`);
    error.statusCode = 403;
    throw error;
  }
};

const ensureSlugUnique = async (slug, excludeId = null) => {
  const query = { slug };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  const existing = await Campaign.findOne(query);
  if (existing) {
    const error = new Error('Slug already exists. Choose another unique slug.');
    error.statusCode = 409;
    throw error;
  }
};

const generateCloneSlug = async (baseSlug) => {
  let attempt = 1;
  let candidate;
  do {
    candidate = `${baseSlug}-copy${attempt > 1 ? `-${attempt}` : ''}`;
    const exists = await Campaign.exists({ slug: candidate });
    if (!exists) {
      return candidate;
    }
    attempt += 1;
  } while (attempt < 1000);

  throw new Error('Unable to generate unique slug for clone');
};

export const listCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find({ owner: req.user._id }).sort({ updatedAt: -1 });
    return res.json({ campaigns: campaigns.map(serialiseCampaign) });
  } catch (error) {
    return next(error);
  }
};

export const createCampaign = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await ensureCampaignQuota(req.user._id, req.user.plan);

    const slug = normaliseSlug(req.body.name, req.body.slug);
    await ensureSlugUnique(slug);

    const campaign = await Campaign.create({
      owner: req.user._id,
      name: req.body.name,
      slug,
      pageTitle: req.body.pageTitle,
      squeezePageUrl: req.body.squeezePageUrl,
      delayPopupUrl: req.body.delayPopupUrl,
      delayPopupDelaySeconds: req.body.delayPopupDelaySeconds,
      delayPopupCloseUrl: req.body.delayPopupCloseUrl,
      exitPopupUrl: req.body.exitPopupUrl,
      exitPopupCloseUrl: req.body.exitPopupCloseUrl,
      backgroundColor: req.body.backgroundColor,
    });

    return res.status(201).json({ campaign: serialiseCampaign(campaign) });
  } catch (error) {
    return next(error);
  }
};

export const getCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id, owner: req.user._id });
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    return res.json({ campaign: serialiseCampaign(campaign) });
  } catch (error) {
    return next(error);
  }
};

export const updateCampaign = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const campaign = await Campaign.findOne({ _id: req.params.id, owner: req.user._id });
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (req.body.name !== undefined) {
      campaign.name = req.body.name;
    }

    if (req.body.slug !== undefined) {
      const slug = normaliseSlug(req.body.name ?? campaign.name, req.body.slug);
      if (slug !== campaign.slug) {
        await ensureSlugUnique(slug, campaign._id);
        campaign.slug = slug;
      }
    }

    if (req.body.pageTitle !== undefined) {
      campaign.pageTitle = req.body.pageTitle;
    }
    if (req.body.squeezePageUrl !== undefined) {
      campaign.squeezePageUrl = req.body.squeezePageUrl;
    }
    if (req.body.delayPopupUrl !== undefined) {
      campaign.delayPopupUrl = req.body.delayPopupUrl;
    }
    if (req.body.delayPopupDelaySeconds !== undefined) {
      campaign.delayPopupDelaySeconds = req.body.delayPopupDelaySeconds;
    }
    if (req.body.delayPopupCloseUrl !== undefined) {
      campaign.delayPopupCloseUrl = req.body.delayPopupCloseUrl;
    }
    if (req.body.exitPopupUrl !== undefined) {
      campaign.exitPopupUrl = req.body.exitPopupUrl;
    }
    if (req.body.exitPopupCloseUrl !== undefined) {
      campaign.exitPopupCloseUrl = req.body.exitPopupCloseUrl;
    }
    if (req.body.backgroundColor !== undefined) {
      campaign.backgroundColor = req.body.backgroundColor;
    }

    await campaign.save();

    return res.json({ campaign: serialiseCampaign(campaign) });
  } catch (error) {
    return next(error);
  }
};

export const deleteCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    return res.json({ message: 'Campaign deleted' });
  } catch (error) {
    return next(error);
  }
};

export const cloneCampaign = async (req, res, next) => {
  try {
    await ensureCampaignQuota(req.user._id, req.user.plan);

    const original = await Campaign.findOne({ _id: req.params.id, owner: req.user._id });
    if (!original) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const clonedSlug = await generateCloneSlug(original.slug);

    const clone = await Campaign.create({
      owner: req.user._id,
      name: `${original.name} (copy)`,
      slug: clonedSlug,
      pageTitle: original.pageTitle,
      squeezePageUrl: original.squeezePageUrl,
      delayPopupUrl: original.delayPopupUrl,
      delayPopupDelaySeconds: original.delayPopupDelaySeconds,
      delayPopupCloseUrl: original.delayPopupCloseUrl,
      exitPopupUrl: original.exitPopupUrl,
      exitPopupCloseUrl: original.exitPopupCloseUrl,
      backgroundColor: original.backgroundColor,
    });

    return res.status(201).json({ campaign: serialiseCampaign(clone) });
  } catch (error) {
    return next(error);
  }
};

export const findBySlug = async (req, res, next) => {
  try {
    const campaign = await Campaign.findOne({ slug: req.params.slug });
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    return res.json({ campaign: serialiseCampaign(campaign) });
  } catch (error) {
    return next(error);
  }
};
