export const defaultMetadata = {
  metadataBase: new URL('https://konyakebapevi.com'),
  alternates: {
    canonical: '/',
  },
  title: 'Konya Kebap Evi | Lezzet Mirası',
  description: 'Konya Kebap Evi - Asırlık lezzetleri modern sunumlarla buluşturan, Konya mutfağının en seçkin temsilcisi.',
  keywords: 'konya kebap evi, etliekmek, kebap, konya mutfağı, restoran, yemek',
  openGraph: {
    title: 'Konya Kebap Evi | Lezzet Mirası',
    description: 'Konya Kebap Evi - Asırlık lezzetleri modern sunumlarla buluşturan, Konya mutfağının en seçkin temsilcisi.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Konya Kebap Evi',
    images: [
      {
        url: '/logo.png',
        width: 1928,
        height: 470,
        alt: 'Konya Kebap Evi Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Konya Kebap Evi | Lezzet Mirası',
    description: 'Konya Kebap Evi - Asırlık lezzetleri modern sunumlarla buluşturan, Konya mutfağının en seçkin temsilcisi.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
    shortcut: '/favicon-32.png',
  },
};
