import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,ts,jsx,tsx}',
		'./src/app/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				bits: {
					blue: '#002E6D',
					gold: '#C28E0E',
					cream: '#F5F1E6',
				}
			}
		}
	},
	plugins: []
}
export default config