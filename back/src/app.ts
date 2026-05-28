import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { xss } from 'express-xss-sanitizer';
import apiRouter from './routers/index.router.js';

const app = express();

app.use(helmet());
const allowedOrigins = [process.env.CORS_ORIGIN].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      console.log('🌍 CORS ORIGIN RECEIVED:', origin);

      if (!origin) return cb(null, true); // curl / postman

      if (allowedOrigins.includes(origin)) {
        return cb(null, true);
      }

      console.log('❌ BLOCKED ORIGIN:', origin);

      return cb(new Error('Not allowed by CORS'));
    },

    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(xss());

app.use('/api', apiRouter);

app.use((req, res, next) => {
  console.log('REQ:', req.method, req.url);

  console.log('ORIGIN:', req.headers.origin);

  next();
});

export default app;
