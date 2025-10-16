export default function StructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Paperpatch',
    description: 'Custom self-adhesive poster prints, stickers, wall art, and photo printing service in Bangladesh. High-quality sticky posters and wall decor.',
    url: 'https://paperpatch.shop',
    logo: 'https://paperpatch.shop/logo.jpg',
    image: 'https://paperpatch.shop/logo.jpg',
    priceRange: '৳৳',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BD',
      addressLocality: 'Dhaka',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 23.8103,
      longitude: 90.4125,
    },
    sameAs: [
      'https://instagram.com/paperpatchbd/',
    ],
    areaServed: {
      '@type': 'Country',
      name: 'Bangladesh',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Custom Poster Printing, Stickers & Wall Art Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Custom Self-Adhesive Poster Prints',
            description: 'High-quality custom self-adhesive sticky poster printing service and wall art',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Photo Prints & Stickers',
            description: 'Professional photo printing service, custom stickers, and wall decor',
          },
        },
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
