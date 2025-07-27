import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import AuthContext from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-primary text-white selection:bg-accent/20">
        <AuthContext>
          {children}
        </AuthContext>
        <Analytics />
      </body>
    </html>
  )
} 