import type { Metadata } from 'next'
import { DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'
import StructuredData from './schema'

const dmSans = DM_Sans({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})

const dmMono = DM_Mono({ 
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-mono',
  display: 'swap',
  preload: true,
  fallback: ['monospace']
})

export const metadata: Metadata = {
  metadataBase: new URL('https://paperpatch.shop'),
  title: 'Paperpatch - Custom Posters, Stickers & Wall Art in Bangladesh',
  description: 'Order custom self-adhesive poster prints in Bangladesh. High-quality photo prints, personalized wall art, and handmade glue posters delivered across Dhaka and Bangladesh. Affordable prices, fast delivery.',
  keywords: 'custom posters bd, stickers bd, wall art Bangladesh, custom posters Bangladesh, self adhesive posters BD, sticky posters, decor Bangladesh, glue posters Dhaka, poster printing BD, photo prints Dhaka, personalized posters, wall decor, custom prints BD, poster shop Dhaka, photo printing Bangladesh, handmade posters, adhesive wall art, sticker printing bd, wall stickers Bangladesh',
  authors: [{ name: 'Paperpatch' }],
  creator: 'Paperpatch',
  publisher: 'Paperpatch',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Paperpatch - Custom Poster Prints, Stickers & Wall Art in Bangladesh',
    description: 'Create beautiful custom posters, stickers, and wall decor. High-quality sticky prints and wall art, handmade with care, delivered across Bangladesh.',
    url: 'https://paperpatch.shop',
    siteName: 'Paperpatch',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Paperpatch - Custom Poster Prints Bangladesh',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paperpatch - Custom Poster Prints, Stickers & Wall Art in Bangladesh',
    description: 'Create beautiful custom posters, stickers, and wall decor. High-quality sticky prints and wall art, handmade with care.',
    images: ['/logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '5uMi8RmvLnyQmAaeOxST-TaGZBgJi4p0HC0LpUHjIkI',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <StructuredData />
      </head>
      <body className={`${dmSans.variable} ${dmMono.variable} font-sans bg-paper-50`}>
        {children}
      </body>
    </html>
  )
}
