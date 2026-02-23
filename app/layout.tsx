import { ReduxProvider } from '@/Redux/providers/ReduxProvider';
import type { Metadata, Viewport } from 'next';
import "./globals.css"

export const metadata: Metadata = {
	title: 'Omega',
	description: 'Omega',
	// Remove this line since you're using manifest.ts now
	// manifest: "/manifest.json",
	appleWebApp: {
		capable: true,
		statusBarStyle: 'black-translucent',
		title: 'Omega'
	},
	formatDetection: {
		telephone: false
	},
	other: {
		'mobile-web-app-capable': 'yes',
		'apple-mobile-web-app-capable': 'yes',
		'apple-mobile-web-app-status-bar-style': 'black-translucent'
	}
};

// Add viewport configuration for PWA
export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	viewportFit: 'cover',
	themeColor: '#000000'
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				{/* Additional PWA meta tags */}
				<meta name="theme-color" content="#000000" />
			</head>
			<body
				// className="uk-height-viewport"
				style={{
					margin: 0,
					padding: 0,
					width: '100vw',
					height: '100vh',
					backgroundColor: '#000000',
					minWidth: 'px'
				}}
			>
				<ReduxProvider>
					{children}
				</ReduxProvider>
			</body>
		</html>
	);
}
