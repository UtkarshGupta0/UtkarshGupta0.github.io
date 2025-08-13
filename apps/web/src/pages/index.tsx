import Head from 'next/head';

export default function Home() {
	return (
		<>
			<Head>
				<title>BITS Professor Ratings</title>
			</Head>
			<div className="p-6 bg-bits-cream min-h-screen">
				<h1 className="text-3xl font-semibold text-bits-blue">Welcome</h1>
				<p className="mt-2 text-gray-700">Secure, BITS-only professor ratings with a modern, card-based design.</p>
			</div>
		</>
	);
}