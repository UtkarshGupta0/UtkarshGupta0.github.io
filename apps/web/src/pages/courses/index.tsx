import useSWR from 'swr';
import axios from 'axios';

const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const fetcher = (url: string) => axios.get(url).then((r) => r.data);

export default function CoursesPage() {
	const { data, error, isLoading } = useSWR(`${api}/courses`, fetcher);
	if (error) return <div className="p-6">Failed to load</div>;
	if (isLoading) return <div className="p-6">Loading...</div>;
	return (
		<div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{data.map((c: any) => (
				<div key={c.id} className="bg-white rounded-xl shadow p-4">
					<div className="font-semibold text-bits-blue">{c.code} — {c.name}</div>
					<div className="text-sm text-gray-600">{c.creditHours} credits</div>
					<p className="text-sm mt-2 text-gray-700 line-clamp-3">{c.description}</p>
				</div>
			))}
		</div>
	);
}