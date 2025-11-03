import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { attachOptionalUser } from './middleware/auth.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import router from './routes/index.js';

const app = express();

app.use(
  cors({
    origin: [env.clientUrl],
    credentials: true,
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(attachOptionalUser);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', router);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`API ready at http://localhost:${env.port}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
