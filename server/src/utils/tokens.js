import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';

export const signAuthToken = (user) =>
  jwt.sign(
    {
      sub: user._id,
      email: user.email,
      plan: user.plan,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    }
  );

export const verifyAuthToken = (token) => jwt.verify(token, env.jwtSecret);
