import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
	userId?: string;
	userRole?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
	const auth = req.headers.authorization;
	if (!auth || !auth.startsWith('Bearer ')) {
		return res.status(401).json({ error: 'Missing token' });
	}
	try {
		const token = auth.slice(7);
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
		req.userId = decoded.sub;
		req.userRole = decoded.role;
		return next();
	} catch (err) {
		return res.status(401).json({ error: 'Invalid token' });
	}
}