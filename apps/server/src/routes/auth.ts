import { Router } from 'express';
import Joi from 'joi';
import { PrismaClient, VerificationPurpose } from '@prisma/client';
import { isAllowedBitsEmail } from '../utils/allowedDomains';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';
import argon2 from 'argon2';
import jwt, { SignOptions } from 'jsonwebtoken';

const prisma = new PrismaClient();
const router = Router();

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT || 587),
	secure: false,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

router.post('/signup', async (req, res) => {
	const schema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(8).required(),
		name: Joi.string().min(2).required(),
		campus: Joi.string().valid('PILANI', 'GOA', 'HYDERABAD', 'DUBAI').required(),
	});
	const { error, value } = schema.validate(req.body);
	if (error) return res.status(400).json({ error: error.message });

	const { email, password, name, campus } = value;
	if (!isAllowedBitsEmail(email)) return res.status(400).json({ error: 'Email must be a verified BITS campus address' });

	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) return res.status(409).json({ error: 'Email already registered' });

	const passwordHash = await argon2.hash(password);
	const user = await prisma.user.create({ data: { email, passwordHash, name, campus } });

	const token = randomBytes(24).toString('hex');
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
	await prisma.emailVerification.create({
		data: { userId: user.id, token, expiresAt, purpose: 'SIGNUP' as VerificationPurpose },
	});

	const verifyUrl = `${process.env.CORS_ORIGIN}/verify?token=${token}`;
	await transporter.sendMail({
		from: process.env.SMTP_FROM,
		to: email,
		subject: 'Verify your BITS Ratings account',
		html: `<p>Hi ${name},</p><p>Verify your account: <a href="${verifyUrl}">${verifyUrl}</a></p>`
	});

	res.status(201).json({ ok: true });
});

router.post('/verify', async (req, res) => {
	const schema = Joi.object({ token: Joi.string().required() });
	const { error, value } = schema.validate(req.body);
	if (error) return res.status(400).json({ error: error.message });

	const { token } = value;
	const record = await prisma.emailVerification.findUnique({ where: { token } });
	if (!record || record.expiresAt < new Date()) return res.status(400).json({ error: 'Invalid or expired token' });

	await prisma.user.update({ where: { id: record.userId }, data: { emailVerifiedAt: new Date() } });
	await prisma.emailVerification.delete({ where: { id: record.id } });
	res.json({ ok: true });
});

router.post('/login', async (req, res) => {
	const schema = Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() });
	const { error, value } = schema.validate(req.body);
	if (error) return res.status(400).json({ error: error.message });

	const { email, password } = value;
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user || !user.passwordHash) return res.status(401).json({ error: 'Invalid credentials' });

	const now = new Date();
	if (user.failedLoginAttempts >= 5 && user.lastLoginAttemptAt && now.getTime() - user.lastLoginAttemptAt.getTime() < 15 * 60 * 1000) {
		return res.status(429).json({ error: 'Too many attempts. Try again later.' });
	}

	const valid = await argon2.verify(user.passwordHash, password);
	await prisma.user.update({
		where: { id: user.id },
		data: {
			failedLoginAttempts: valid ? 0 : (user.failedLoginAttempts + 1),
			lastLoginAttemptAt: now,
		}
	});
	if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
	if (!user.emailVerifiedAt) return res.status(403).json({ error: 'Email not verified' });

	const options: SignOptions = { expiresIn: (process.env.JWT_EXPIRES_IN as any) || '7d' };
	const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET as string, options);
	res.json({ token });
});

export default router;