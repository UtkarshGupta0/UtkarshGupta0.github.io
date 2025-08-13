import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';
import { requireAuth, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (_req, res) => {
	const q = await prisma.course.findMany({ take: 100, orderBy: { code: 'asc' } });
	res.json(q);
});

router.post('/', requireAuth, async (req: AuthRequest, res) => {
	if (req.userRole !== 'ADMIN' && req.userRole !== 'MODERATOR') return res.status(403).json({ error: 'Forbidden' });
	const schema = Joi.object({
		code: Joi.string().required(),
		name: Joi.string().required(),
		description: Joi.string().allow('', null),
		creditHours: Joi.number().integer().required(),
		prerequisites: Joi.array().items(Joi.string()).default([]),
		isLab: Joi.boolean().default(false),
		isTutorial: Joi.boolean().default(false),
		materialRequirements: Joi.array().items(Joi.string()).default([]),
	});
	const { error, value } = schema.validate(req.body);
	if (error) return res.status(400).json({ error: error.message });

	const created = await prisma.course.create({ data: value });
	res.status(201).json(created);
});

export default router;