import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/ui/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'notesnugget.com | Tag-Based Notes',
  description: 'A tag-based notes app to keep all those nuggets of information',
  referrer: 'origin-when-cross-origin',
  keywords: ['Notes', 'Tags', 'AI', 'Nuggets'],
  authors: [{ name: 'Daniel Santos', url: 'https://danielsantosdev.vercel.app/' }],
  creator: 'Daniel Santos',
};

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
