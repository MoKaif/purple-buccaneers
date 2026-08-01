import './globals.css';
import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import { SITE_URL } from '@/lib/site';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron', weight: ['400', '500', '600', '700', '800', '900'] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Purple Buccaneers — Gaming Community Hub',
    template: '%s',
  },
  description: 'The official home of the Purple Buccaneers gaming community. Events, FIFA League, members, and more.',
  openGraph: {
    type: 'website',
    siteName: 'Purple Buccaneers',
    title: 'Purple Buccaneers — Gaming Community Hub',
    description: 'The official home of the Purple Buccaneers gaming community.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Purple Buccaneers — Gaming Community Hub',
    description: 'The official home of the Purple Buccaneers gaming community.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${orbitron.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
