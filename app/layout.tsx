import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  // Base URL for resolving Open Graph and Twitter images
  metadataBase: new URL('https://attack.valid.or.kr'),
  title: '주문, 피청구인 윤석열을 탄핵하라 - 내란범 윤석열의 신속 탄핵을 촉구하는 100만 시민의견 헌재 전달 프로젝트',
  description: '주문, 피청구인 윤석열을 탄핵하라 - 내란범 윤석열의 신속 탄핵을 촉구하는 100만 시민의견 헌재 전달 프로젝트',
  openGraph: {
    images: [
      {
        url: '/assets/images/og-image.png',
        width: 1200,
        height: 630,
        alt: '주문, 피청구인 윤석열을 탄핵하라 - 내란범 윤석열의 신속 탄핵을 촉구하는 100만 시민의견 헌재 전달 프로젝트',
        type: 'image/png',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
    siteName: '주문, 피청구인 윤석열을 탄핵하라',
    title: '주문, 피청구인 윤석열을 탄핵하라 - 내란범 윤석열의 신속 탄핵을 촉구하는 100만 시민의견 헌재 전달 프로젝트',
    description: '주문, 피청구인 윤석열을 탄핵하라 - 내란범 윤석열의 신속 탄핵을 촉구하는 100만 시민의견 헌재 전달 프로젝트',
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: 'summary_large_image',
    title: '주문, 피청구인 윤석열을 탄핵하라 - 내란범 윤석열의 신속 탄핵을 촉구하는 100만 시민의견 헌재 전달 프로젝트',
    description: '주문, 피청구인 윤석열을 탄핵하라 - 내란범 윤석열의 신속 탄핵을 촉구하는 100만 시민의견 헌재 전달 프로젝트',
    images: ['/assets/images/og-image.png'],
  },
  alternates: {
    canonical: 'https://attack.valid.or.kr',
  },
  keywords: '탄핵, 윤석열, 헌법재판소, 시민의견',
  authors: [{ name: 'VALID - 전진하는 민주주의' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "flex flex-col justify-center items-center")}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}