'use client'

import { useEffect } from 'react'

export default function WeddingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-300 mb-8">
          We're sorry, but there was an error loading this page.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-accent text-primary rounded-full font-medium hover:bg-accent/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
} 