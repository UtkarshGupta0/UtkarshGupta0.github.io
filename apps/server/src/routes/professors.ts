import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';
import { requireAuth, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (_req, res) => {
	const q = await prisma.professor.findMany({ take: 50, orderBy: { fullName: 'asc' } });
	res.json(q);
});

router.post('/', requireAuth, async (req: AuthRequest, res) => {
	if (req.userRole !== 'ADMIN' && req.userRole !== 'MODERATOR') return res.status(403).json({ error: 'Forbidden' });
	const schema = Joi.object({
		firstName: Joi.string().required(),
		lastName: Joi.string().required(),
		fullName: Joi.string().required(),
		department: Joi.string().required(),
		campus: Joi.string().valid('PILANI', 'GOA', 'HYDERABAD', 'DUBAI').required(),
	});
	const { error, value } = schema.validate(req.body);
	if (error) return res.status(400).json({ error: error.message });

	const created = await prisma.professor.create({ data: value });
	res.status(201).json(created);
});

export default router;