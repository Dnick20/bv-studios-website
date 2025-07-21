import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Wedding Videography | BV Studios',
  description: 'Professional wedding videography services in Lexington, Kentucky. Capturing your special moments with cinematic excellence.',
  openGraph: {
    title: 'Wedding Videography | BV Studios',
    description: 'Professional wedding videography services in Lexington, Kentucky. Capturing your special moments with cinematic excellence.',
    url: 'https://bvstudios.com/weddings',
    siteName: 'BV Studios',
    locale: 'en_US',
    type: 'website',
  },
}

export default function WeddingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-wedding-primary">
      <Navigation />
      <div className="relative">
        {/* Decorative background elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,theme(colors.wedding.accent/0.15),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,theme(colors.wedding.accent/0.1),transparent_70%)]" />
        </div>
        {children}
      </div>
    </div>
  )
} 