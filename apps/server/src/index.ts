import 'dotenv/config';
import pino from 'pino';
import app from './app';

const logger = pino({ transport: { target: 'pino-pretty' } });

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
	logger.info(`API listening on http://localhost:${port}`);
});