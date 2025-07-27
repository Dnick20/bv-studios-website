export default function TestSimple() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">✅ Basic Page Working!</h1>
        <p className="text-xl text-gray-300 mb-8">The basic Next.js setup is functioning correctly.</p>
        
        <div className="space-y-4">
          <a 
            href="/"
            className="block px-6 py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 transition-colors"
          >
            Go to Home Page
          </a>
          
          <a 
            href="/api/test-simple"
            className="block px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Test API
          </a>
        </div>
      </div>
    </div>
  )
} 