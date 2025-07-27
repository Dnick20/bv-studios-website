import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="BV Studios - Professional Video Production in Lexington, KY" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="min-h-screen bg-primary text-white selection:bg-accent/20">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 