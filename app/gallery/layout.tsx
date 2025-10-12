import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Poster Gallery | Custom Poster Designs & Examples - Paperpatch Bangladesh',
  description: 'Browse our gallery of custom poster prints and photo wall art. Get inspiration for your personalized posters. See real customer designs from Bangladesh.',
  keywords: 'poster gallery Bangladesh, custom poster examples, poster design ideas, wall art gallery, photo print samples Dhaka',
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
