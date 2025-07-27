export default function NoAuth() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">✅ No Auth Test</h1>
        <p className="text-xl text-gray-300 mb-8">
          This page doesn't use NextAuth at all.
        </p>
        
        <div className="space-y-4">
          <div className="text-accent text-lg">
            If this works, the issue is with NextAuth configuration.
          </div>
          
          <div className="space-x-4">
            <a 
              href="/"
              className="inline-block px-6 py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 transition-colors"
            >
              Test Home Page
            </a>
            
            <a 
              href="/working"
              className="inline-block px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Test Working Page
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 