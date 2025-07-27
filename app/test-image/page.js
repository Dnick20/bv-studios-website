'use client'

export default function TestImage() {
  return (
    <div className="min-h-screen bg-primary p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">🖼️ Image Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-accent mb-4">Wedding Image Test</h2>
            <div className="bg-black/30 p-4 rounded-lg border border-gray-700">
              <img 
                src="/images/portfolio/wedding-highlights.webp"
                alt="Wedding Highlights"
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div 
                className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400"
                style={{ display: 'none' }}
              >
                Image not found: /images/portfolio/wedding-highlights.webp
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-accent mb-4">Instructions</h2>
            <div className="bg-black/30 p-4 rounded-lg border border-gray-700">
              <p className="text-gray-300 mb-4">
                To upload your wedding image:
              </p>
              <ol className="text-gray-300 text-sm space-y-2">
                <li>1. Convert your image to .webp format</li>
                <li>2. Save as: <code className="bg-gray-800 px-2 py-1 rounded">wedding-highlights.webp</code></li>
                <li>3. Place in: <code className="bg-gray-800 px-2 py-1 rounded">public/images/portfolio/</code></li>
                <li>4. Refresh this page to test</li>
              </ol>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
} 