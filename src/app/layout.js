import './globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  title: 'Konya Kebap Evi | Lezzet Mirası',
  description: 'Konya Kebap Evi - Asırlık lezzetleri modern sunumlarla buluşturan, Konya mutfağının en seçkin temsilcisi.',
  keywords: 'konya kebap evi, etliekmek, kebap, konya mutfağı, restoran, yemek',
  openGraph: {
    title: 'Konya Kebap Evi | Lezzet Mirası',
    description: 'Konya Kebap Evi - Asırlık lezzetleri modern sunumlarla buluşturan, Konya mutfağının en seçkin temsilcisi.',
    type: 'website',
  },
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
