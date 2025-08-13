import { Router } from 'express';
import { PrismaClient, Difficulty } from '@prisma/client';
import Joi from 'joi';
import { requireAuth, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

const schema = Joi.object({
	professorId: Joi.string().required(),
	courseOfferingId: Joi.string().optional(),
	overallQuality: Joi.number().integer().min(1).max(5).required(),
	teachingClarity: Joi.number().integer().min(1).max(5).required(),
	helpfulness: Joi.number().integer().min(1).max(5).required(),
	courseDifficulty: Joi.string().valid('EASY', 'MODERATE', 'HARD').required(),
	gradingFairness: Joi.number().integer().min(1).max(5).required(),
	engagementLevel: Joi.number().integer().min(1).max(5).required(),
	courseOrganization: Joi.number().integer().min(1).max(5).required(),
	technologyUse: Joi.number().integer().min(1).max(5).required(),
	gradeReceived: Joi.string().optional(),
	attendanceRequired: Joi.boolean().optional(),
	textbookUsage: Joi.number().integer().min(1).max(5).optional(),
	assignmentLoad: Joi.number().integer().min(1).max(5).optional(),
	examDifficulty: Joi.number().integer().min(1).max(5).optional(),
	extraCredit: Joi.boolean().optional(),
	isAnonymous: Joi.boolean().optional(),
	content: Joi.string().min(50).required()
});

router.post('/', requireAuth, async (req: AuthRequest, res) => {
	const { error, value } = schema.validate(req.body);
	if (error) return res.status(400).json({ error: error.message });
	const created = await prisma.review.create({
		data: {
			...value,
			userId: req.userId!,
		}
	});
	res.status(201).json(created);
});

export default router;