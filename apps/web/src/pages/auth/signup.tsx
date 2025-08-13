import { useState } from 'react';
import axios from 'axios';

const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function SignupPage() {
	const [form, setForm] = useState({ name: '', campus: 'PILANI', email: '', password: '' });
	const [msg, setMsg] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true); setMsg(null);
		try {
			await axios.post(`${api}/auth/signup`, form);
			setMsg('Check your email for the verification link.');
		} catch (err: any) {
			setMsg(err.response?.data?.error || 'Failed');
		} finally { setLoading(false); }
	}

	return (
		<div className="p-6 max-w-md">
			<h1 className="text-2xl font-semibold text-bits-blue mb-4">Create account</h1>
			<form onSubmit={submit} className="space-y-3">
				<input className="w-full border rounded px-3 py-2" placeholder="Full name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required />
				<select className="w-full border rounded px-3 py-2" value={form.campus} onChange={e=>setForm({...form, campus: e.target.value})}>
					<option value="PILANI">Pilani</option>
					<option value="GOA">Goa</option>
					<option value="HYDERABAD">Hyderabad</option>
					<option value="DUBAI">Dubai</option>
				</select>
				<input className="w-full border rounded px-3 py-2" type="email" placeholder="BITS email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} required />
				<input className="w-full border rounded px-3 py-2" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password: e.target.value})} required />
				<button disabled={loading} className="bg-bits-blue text-white px-4 py-2 rounded disabled:opacity-50">{loading ? 'Creating...' : 'Create account'}</button>
			</form>
			{msg && <p className="mt-3 text-sm">{msg}</p>}
		</div>
	);
}