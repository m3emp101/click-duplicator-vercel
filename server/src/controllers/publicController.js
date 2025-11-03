import { Campaign } from '../models/Campaign.js';
import { renderCampaignPage } from '../templates/campaignPage.js';

export const renderCampaignBySlug = async (req, res, next) => {
  try {
    const campaign = await Campaign.findOne({ slug: req.params.slug });
    if (!campaign) {
      return res.status(404).send('<h1>Campaign not found</h1>');
    }

    res.setHeader('Content-Type', 'text/html');
    return res.send(renderCampaignPage(campaign));
  } catch (error) {
    return next(error);
  }
};
