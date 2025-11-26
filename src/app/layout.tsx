import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { FirebaseProvider } from '@/firebase/provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { I18nProvider } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Skills4Work Event Management',
  description: 'Online Event Booking and Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap"
            rel="stylesheet"
          />
        </head>
        <body
          className={cn(
            'min-h-screen bg-background font-body font-sans antialiased'
          )}
        >
          <I18nProvider>
            <FirebaseProvider>
              {children}
              <Toaster />
              <FirebaseErrorListener />
            </FirebaseProvider>
          </I18nProvider>
        </body>
      </html>
  );
}
