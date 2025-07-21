import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BV Studios | Professional Video Production in Lexington, KY',
  description: 'Expert video production services in Lexington, Kentucky. We create compelling video content that drives results for your business.',
  keywords: 'video production, commercial video, brand story, event coverage, Lexington, Kentucky',
  openGraph: {
    title: 'BV Studios | Professional Video Production in Lexington, KY',
    description: 'Expert video production services in Lexington, Kentucky. We create compelling video content that drives results for your business.',
    url: 'https://bvstudios.com',
    siteName: 'BV Studios',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-primary text-white selection:bg-accent/20">
        {children}
      </body>
    </html>
  )
} 