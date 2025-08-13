import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res) => {
	const q = String(req.query.q || '').trim();
	if (!q) return res.json({ professors: [], courses: [] });
	const [professors, courses] = await Promise.all([
		prisma.professor.findMany({
			where: {
				OR: [
					{ fullName: { contains: q, mode: 'insensitive' } },
					{ department: { contains: q, mode: 'insensitive' } },
				]
			},
			take: 10
		}),
		prisma.course.findMany({
			where: {
				OR: [
					{ code: { contains: q, mode: 'insensitive' } },
					{ name: { contains: q, mode: 'insensitive' } },
				]
			},
			take: 10
		})
	]);
	res.json({ professors, courses });
});

export default router;