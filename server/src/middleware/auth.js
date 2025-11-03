import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { verifyAuthToken } from '../utils/tokens.js';

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.[env.cookieName] || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = verifyAuthToken(token);
    const user = await User.findById(decoded.sub);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};

export const attachOptionalUser = async (req, _res, next) => {
  try {
    const token = req.cookies?.[env.cookieName] || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return next();
    }

    const decoded = verifyAuthToken(token);
    const user = await User.findById(decoded.sub);

    if (user) {
      req.user = user;
    }
  } catch (error) {
    console.warn('Failed to attach optional user', error.message);
  }

  return next();
};
