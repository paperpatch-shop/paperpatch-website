export default function StructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Paperpatch',
    description: 'Custom self-adhesive poster prints and photo printing service in Bangladesh',
    url: 'https://paperpatch.shop',
    logo: 'https://paperpatch.shop/logo.png',
    image: 'https://paperpatch.shop/logo.png',
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
      name: 'Custom Poster Printing Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Custom Self-Adhesive Poster Prints',
            description: 'High-quality custom self-adhesive poster printing service',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Photo Prints',
            description: 'Professional photo printing service',
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
