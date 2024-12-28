import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  // Base URL for resolving Open Graph and Twitter images
  metadataBase: new URL('https://attack.valid.or.kr'),
  title: '헌재로 보내자 - 우리가 원하는 미래를 쟁취하는 가장 빠르고 확실한 방법',
  description: '윤석열 탄핵심판 국민참여의견서 작성',
  openGraph: {
    images: [
      {
        url: '/assets/images/og-image.png',
        width: 1200,
        height: 630,
        alt: '헌재로 보내자 - 우리가 원하는 미래를 쟁취하는 가장 빠르고 확실한 방법',
        type: 'image/png',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
    siteName: '헌재로 보내자',
    title: '헌재로 보내자 - 우리가 원하는 미래를 쟁취하는 가장 빠르고 확실한 방법',
    description: '윤석열 탄핵심판 국민참여의견서 작성',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}