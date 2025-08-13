import useSWR from 'swr';
import axios from 'axios';
import HexRating from '../../components/HexRating';

const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const fetcher = (url: string) => axios.get(url).then((r) => r.data);

export default function ProfessorsPage() {
	const { data, error, isLoading } = useSWR(`${api}/professors`, fetcher);
	if (error) return <div className="p-6">Failed to load</div>;
	if (isLoading) return <div className="p-6">Loading...</div>;
	return (
		<div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{data.map((p: any) => (
				<div key={p.id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
					<HexRating value={4.2} />
					<div>
						<div className="font-semibold text-bits-blue">{p.fullName}</div>
						<div className="text-sm text-gray-600">{p.department} • {p.campus}</div>
					</div>
				</div>
			))}
		</div>
	);
}