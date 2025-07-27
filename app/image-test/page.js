'use client'

export default function ImageTest() {
  return (
    <div className="min-h-screen bg-primary p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">🖼️ Image Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Test 1: Direct Image */}
          <div>
            <h2 className="text-2xl font-bold text-accent mb-4">Direct Image Test</h2>
            <div className="bg-black/30 p-4 rounded-lg border border-gray-700">
              <img 
                src="/images/portfolio/wedding-highlights.webp"
                alt="Wedding Highlights"
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  console.error('Image failed to load:', e.target.src);
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div 
                className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400"
                style={{ display: 'none' }}
              >
                ❌ Image not found: /images/portfolio/wedding-highlights.webp
              </div>
            </div>
          </div>

          {/* Test 2: Portfolio Component */}
          <div>
            <h2 className="text-2xl font-bold text-accent mb-4">Portfolio Image Test</h2>
            <div className="bg-black/30 p-4 rounded-lg border border-gray-700">
              <img 
                src="/images/optimized/portfolio/wedding-hero.webp"
                alt="Wedding Hero"
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  console.error('Image failed to load:', e.target.src);
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div 
                className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400"
                style={{ display: 'none' }}
              >
                ❌ Image not found: /images/optimized/portfolio/wedding-hero.webp
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-8 p-6 bg-black/30 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">📊 Image Status</h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-300">✅ <strong>Test Image:</strong> /images/portfolio/wedding-highlights.webp</p>
            <p className="text-gray-300">✅ <strong>Backup Image:</strong> /images/optimized/portfolio/wedding-hero.webp</p>
            <p className="text-gray-300">🔍 <strong>Check Console:</strong> For any loading errors</p>
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