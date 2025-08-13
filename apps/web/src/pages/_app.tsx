import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import '../styles/globals.css';
import Sidebar from '../components/Sidebar';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<div className="min-h-screen flex">
				<Sidebar />
				<main className="flex-1">
					<Component {...pageProps} />
				</main>
			</div>
		</ThemeProvider>
	);
}