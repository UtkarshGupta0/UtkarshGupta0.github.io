import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import indexRouter from './routes/index';
import authRouter from './routes/auth';
import professorsRouter from './routes/professors';
import reviewsRouter from './routes/reviews';
import searchRouter from './routes/search';
import coursesRouter from './routes/courses';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Global rate limit
app.use(rateLimit({ windowMs: 60 * 1000, max: 300 }));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/', indexRouter);
// Stricter limit for auth actions
app.use('/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 50 }), authRouter);
app.use('/professors', professorsRouter);
app.use('/reviews', reviewsRouter);
app.use('/search', searchRouter);
app.use('/courses', coursesRouter);

export default app;