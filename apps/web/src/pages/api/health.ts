import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
	try {
		const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
		const json = await r.json();
		res.status(200).json(json);
	} catch (e) {
		res.status(500).json({ ok: false });
	}
}