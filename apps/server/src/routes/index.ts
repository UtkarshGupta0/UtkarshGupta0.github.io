import { Router } from 'express';

const router = Router();
router.get('/', (_req, res) => {
	res.json({
		name: 'BITS Ratings API',
		endpoints: {
			health: '/health',
			auth: '/auth/*',
			professors: '/professors',
			reviews: '/reviews',
			courses: '/courses',
			search: '/search?q={query}',
		},
	});
});

export default router;