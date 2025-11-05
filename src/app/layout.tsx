import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { LanguageProvider } from '@/context/language-context';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'Mshkur AI Studio',
  description: 'Create your professional digital card with the power of AI.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <FirebaseClientProvider>
        <html lang="en" className="dark">
          <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin="anonymous"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500&display=swap"
              rel="stylesheet"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap"
              rel="stylesheet"
            />
            <meta name="theme-color" content="#2B3035" />
          </head>
          <body className={cn('font-body antialiased')}>
            {children}
            <Toaster />
          </body>
        </html>
      </FirebaseClientProvider>
    </LanguageProvider>
  );
}
