import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/click-duplicator',
  jwtSecret: process.env.JWT_SECRET || 'super-secret-development-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  cookieName: process.env.COOKIE_NAME || 'cd_session',
  defaultDelaySeconds: Number(process.env.DEFAULT_DELAY_SECONDS || 15),
};
