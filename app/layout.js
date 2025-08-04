import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import Providers from '../components/Providers'
// import AnalyticsProvider from '../components/AnalyticsProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://bvstudios.com'),
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-primary text-white selection:bg-accent/20">
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
} 