import { body, param } from 'express-validator';

export const registerValidators = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginValidators = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const planUpdateValidators = [
  body('plan').isString().withMessage('Plan must be a string'),
];

export const campaignCreateValidators = [
  body('name').notEmpty().withMessage('Campaign name is required'),
  body('slug').optional().isString().withMessage('Slug must be text'),
  body('pageTitle').notEmpty().withMessage('Page title is required'),
  body('squeezePageUrl').isURL({ require_protocol: true }).withMessage('Valid squeeze page URL required'),
  body('delayPopupUrl').optional().isURL({ require_protocol: true }).withMessage('Delay popup URL must be valid'),
  body('delayPopupDelaySeconds').optional().isInt({ min: 1, max: 600 }).withMessage('Delay must be between 1 and 600 seconds'),
  body('delayPopupCloseUrl').optional().isURL({ require_protocol: true }).withMessage('URL after delay popup closes must be valid'),
  body('exitPopupUrl').optional().isURL({ require_protocol: true }).withMessage('Exit popup URL must be valid'),
  body('exitPopupCloseUrl').optional().isURL({ require_protocol: true }).withMessage('URL after exit popup closes must be valid'),
  body('backgroundColor')
    .optional()
    .matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/)
    .withMessage('Background colour must be a valid hex value'),
];

export const campaignUpdateValidators = [
  param('id').isMongoId().withMessage('Valid campaign id required'),
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('slug').optional().isString().withMessage('Slug must be text'),
  body('pageTitle').optional().notEmpty().withMessage('Page title cannot be empty'),
  body('squeezePageUrl').optional().isURL({ require_protocol: true }).withMessage('Valid squeeze page URL required'),
  body('delayPopupUrl').optional().isURL({ require_protocol: true }).withMessage('Delay popup URL must be valid'),
  body('delayPopupDelaySeconds').optional().isInt({ min: 1, max: 600 }).withMessage('Delay must be between 1 and 600 seconds'),
  body('delayPopupCloseUrl').optional().isURL({ require_protocol: true }).withMessage('URL after delay popup closes must be valid'),
  body('exitPopupUrl').optional().isURL({ require_protocol: true }).withMessage('Exit popup URL must be valid'),
  body('exitPopupCloseUrl').optional().isURL({ require_protocol: true }).withMessage('URL after exit popup closes must be valid'),
  body('backgroundColor')
    .optional()
    .matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/)
    .withMessage('Background colour must be a valid hex value'),
];

export const campaignIdParamValidator = [param('id').isMongoId().withMessage('Valid campaign id required')];

export const campaignSlugValidator = [
  param('slug')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),
];
