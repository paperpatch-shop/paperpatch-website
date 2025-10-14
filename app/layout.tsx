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
  title: 'Paperpatch - Custom Self-Adhesive Poster Prints in Bangladesh | Photo Prints BD',
  description: 'Order custom self-adhesive poster prints in Bangladesh. High-quality photo prints, personalized wall art, and handmade glue posters delivered across Dhaka and Bangladesh. Affordable prices, fast delivery.',
  keywords: 'custom posters bd, custom posters Bangladesh, self adhesive posters BD, glue posters Dhaka, poster printing BD, photo prints Dhaka, personalized posters, wall art Bangladesh, custom prints BD, poster shop Dhaka, photo printing Bangladesh, handmade posters, adhesive wall art',
  authors: [{ name: 'Paperpatch' }],
  creator: 'Paperpatch',
  publisher: 'Paperpatch',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon-32x32.png',
  },
  openGraph: {
    title: 'Paperpatch - Custom Poster Prints in Bangladesh',
    description: 'Create beautiful custom posters and photo prints. Handmade with care, delivered across Bangladesh.',
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
    title: 'Paperpatch - Custom Poster Prints in Bangladesh',
    description: 'Create beautiful custom posters and photo prints. Handmade with care.',
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
