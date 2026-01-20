'use client';

export function RestaurantStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Konya Kebap Evi',
    description: 'Asırlık lezzetleri modern sunumlarla buluşturan, Konya mutfağının en seçkin temsilcisi.',
    image: '/logo.png',
    servesCuisine: 'Turkish Cuisine',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TR',
      addressLocality: 'Konya',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '132',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function MenuStructuredData({ menuItems = [] }) {
  if (menuItems.length === 0) return null;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    hasMenuSection: menuItems.map(category => ({
      '@type': 'MenuSection',
      name: category.title,
      hasMenuItem: category.items?.map(item => ({
        '@type': 'MenuItem',
        name: item.name,
        description: item.description,
        offers: {
          '@type': 'Offer',
          price: item.price,
          priceCurrency: 'TRY',
        },
      })) || [],
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
