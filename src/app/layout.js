import './globals.css';
import { montserrat } from '@/lib/fonts';
import { ReactQueryProvider } from '@/lib/react-query';
import { defaultMetadata } from './metadata';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = defaultMetadata;

export default function RootLayout({ children }) {
  return (
    <html lang="tr" data-scroll-behavior="smooth" className={montserrat.variable}>
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body suppressHydrationWarning>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
