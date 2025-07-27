import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Portfolio from '@/components/Portfolio'
import About from '@/components/About'
import ContactForm from '@/components/ContactForm'

export default function Home() {
  return (
    <main className="relative bg-primary">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-radial from-accent/5 via-primary to-primary pointer-events-none" />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Content */}
      <div className="relative">
        {/* Hero Section */}
        <section id="home" className="relative">
          <Hero />
        </section>

        {/* Services Section */}
        <section id="services" className="relative">
          <Services />
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="relative">
          <Portfolio />
        </section>

        {/* About Section */}
        <section id="about" className="relative">
          <About />
        </section>

        {/* Contact Section */}
        <section id="contact" className="relative">
          <ContactForm />
        </section>
      </div>
    </main>
  )
} 