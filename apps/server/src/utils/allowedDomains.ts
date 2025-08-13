const DISPOSABLE_PATTERNS = [
	/10minutemail|guerrillamail|mailinator|tempmail|yopmail/i,
];

export function isAllowedBitsEmail(email: string): boolean {
	const atIndex = email.indexOf('@');
	if (atIndex === -1) return false;
	if (DISPOSABLE_PATTERNS.some((re) => re.test(email))) return false;
	const domain = email.slice(atIndex + 1).toLowerCase();
	const allowed = (process.env.ALLOWED_EMAIL_DOMAINS || '')
		.split(',')
		.map((d) => d.trim().toLowerCase())
		.filter(Boolean);
	return allowed.includes(domain);
}