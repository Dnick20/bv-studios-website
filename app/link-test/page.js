export default function LinkTest() {
  const links = [
    { name: 'Home Page', href: '/', description: 'Main homepage' },
    { name: 'Weddings Page', href: '/weddings', description: 'Wedding services page' },
    { name: 'About Page', href: '/about', description: 'About us page' },
    { name: 'Commercial Page', href: '/commercial', description: 'Commercial services page' },
    { name: 'Contact Page', href: '/contact', description: 'Contact page' },
    { name: 'Sign In', href: '/auth/signin', description: 'Authentication page' },
    { name: 'Dashboard', href: '/dashboard', description: 'User dashboard' },
    { name: 'Working Test', href: '/working', description: 'Basic working page' },
    { name: 'No Auth Test', href: '/no-auth', description: 'Page without authentication' },
    { name: 'Debug API', href: '/api/debug', description: 'Environment debug endpoint' },
    { name: 'Test API', href: '/api/test-simple', description: 'Simple API test' },
  ]

  const hashLinks = [
    { name: 'Home Section', href: '/#home', description: 'Hero section' },
    { name: 'Services Section', href: '/#services', description: 'Services section' },
    { name: 'Portfolio Section', href: '/#portfolio', description: 'Portfolio section' },
    { name: 'About Section', href: '/#about', description: 'About section' },
    { name: 'Contact Section', href: '/#contact', description: 'Contact section' },
  ]

  return (
    <div className="min-h-screen bg-primary p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">🔗 Link Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Page Links */}
          <div>
            <h2 className="text-2xl font-bold text-accent mb-4">📄 Page Links</h2>
            <div className="space-y-3">
              {links.map((link, index) => (
                <div key={index} className="bg-black/30 p-4 rounded-lg border border-gray-700">
                  <a 
                    href={link.href}
                    className="text-white hover:text-accent transition-colors font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.name}
                  </a>
                  <p className="text-gray-400 text-sm mt-1">{link.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hash Links */}
          <div>
            <h2 className="text-2xl font-bold text-accent mb-4">📍 Hash Links</h2>
            <div className="space-y-3">
              {hashLinks.map((link, index) => (
                <div key={index} className="bg-black/30 p-4 rounded-lg border border-gray-700">
                  <a 
                    href={link.href}
                    className="text-white hover:text-accent transition-colors font-medium"
                  >
                    {link.name}
                  </a>
                  <p className="text-gray-400 text-sm mt-1">{link.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-8 p-6 bg-black/30 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">📊 Link Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-300">✅ <strong>Working:</strong> Page links that should work</p>
              <p className="text-gray-300">⚠️ <strong>May Fail:</strong> Links that depend on environment variables</p>
              <p className="text-gray-300">❌ <strong>Broken:</strong> Links that need to be fixed</p>
            </div>
            <div>
              <p className="text-gray-300">🔗 <strong>External:</strong> Links that open in new tab</p>
              <p className="text-gray-300">📍 <strong>Hash:</strong> Links that scroll to sections</p>
              <p className="text-gray-300">🔧 <strong>API:</strong> Backend endpoints</p>
            </div>
          </div>
        </div>

        {/* Navigation Back */}
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