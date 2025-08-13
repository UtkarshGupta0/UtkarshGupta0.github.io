import React from 'react';

type Props = { value: number; max?: number; size?: number };

export default function HexRating({ value, max = 5, size = 64 }: Props) {
	const ratio = Math.max(0, Math.min(value / max, 1));
	const color = ratio < 0.4 ? '#dc2626' : ratio < 0.7 ? '#ca8a04' : '#16a34a';
	return (
		<div style={{ width: size, height: size }} className="relative">
			<svg viewBox="0 0 100 100" className="w-full h-full">
				<polygon points="50,2 96,25 96,75 50,98 4,75 4,25" fill="#e5e7eb" />
				<clipPath id="hex-clip">
					<polygon points="50,2 96,25 96,75 50,98 4,75 4,25" />
				</clipPath>
				<rect clipPath="url(#hex-clip)" x="0" y="0" width={ratio * 100} height="100" fill={color} />
			</svg>
			<div className="absolute inset-0 flex items-center justify-center text-sm font-semibold" style={{ color }}>
				{value.toFixed(1)}
			</div>
		</div>
	);
}