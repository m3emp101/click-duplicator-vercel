import mongoose from 'mongoose';

import { env } from '../config/env.js';

const campaignSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    pageTitle: {
      type: String,
      required: true,
      trim: true,
    },
    squeezePageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    delayPopupUrl: {
      type: String,
      trim: true,
    },
    delayPopupDelaySeconds: {
      type: Number,
      default: env.defaultDelaySeconds,
      min: 1,
    },
    delayPopupCloseUrl: {
      type: String,
      trim: true,
    },
    exitPopupUrl: {
      type: String,
      trim: true,
    },
    exitPopupCloseUrl: {
      type: String,
      trim: true,
    },
    backgroundColor: {
      type: String,
      default: '#1d4ed8',
    },
  },
  {
    timestamps: true,
  }
);

campaignSchema.index({ owner: 1, slug: 1 });

export const Campaign = mongoose.model('Campaign', campaignSchema);
