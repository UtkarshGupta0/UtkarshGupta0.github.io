import Link from 'next/link';

export default function Sidebar() {
	return (
		<aside className="w-64 bg-bits-blue text-white p-6 hidden md:block">
			<div className="text-2xl font-bold mb-8">BITS Ratings</div>
			<nav className="space-y-3">
				<Link className="block hover:text-bits-gold" href="/">Discover</Link>
				<Link className="block hover:text-bits-gold" href="/professors">Professors</Link>
				<Link className="block hover:text-bits-gold" href="/courses">Courses</Link>
				<Link className="block hover:text-bits-gold" href="/dashboard">My Dashboard</Link>
			</nav>
		</aside>
	);
}