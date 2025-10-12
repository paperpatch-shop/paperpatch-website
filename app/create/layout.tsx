import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Custom Poster | Design Your Self-Adhesive Poster Online - Paperpatch',
  description: 'Design and order custom self-adhesive posters online. Upload your photos, choose sizes, and create personalized wall art. Fast delivery in Bangladesh.',
  keywords: 'create custom poster, design poster online, upload photo poster, custom wall art maker, personalized poster Bangladesh',
}

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
