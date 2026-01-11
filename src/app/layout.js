import './globals.css';

export const metadata = {
  title: 'The Hunger | Premium Restaurant Experience',
  description: 'The Hunger - 2012\'den bu yana lezzet tutkunlarına hizmet veren premium restoran zinciri. Sürdürülebilir, kaliteli ve lezzetli yemekler.',
  keywords: 'restoran, yemek, the hunger, istanbul, kebap, fine dining',
  openGraph: {
    title: 'The Hunger | Premium Restaurant Experience',
    description: 'The Hunger - Premium restoran deneyimi için doğru adres.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
