import Navigation from '@/components/Navigation'

export default function HomeMinimal() {
  return (
    <main className="relative bg-primary min-h-screen">
      {/* Navigation */}
      <Navigation />
      
      {/* Simple Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
            BV Studios
            <span className="text-accent block">Video Production</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-12">
            Professional video production services in Lexington, Kentucky
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="#contact"
              className="px-8 py-4 bg-accent text-primary rounded-none font-medium text-lg shadow-lg transition-all duration-300 hover:bg-accent-light min-w-[200px] tracking-wider uppercase"
            >
              Get Started
            </a>
            <a
              href="#about"
              className="px-8 py-4 bg-transparent border border-white text-white rounded-none font-medium text-lg hover:bg-white/10 transition-all duration-300 min-w-[200px] tracking-wider uppercase"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </main>
  )
} 