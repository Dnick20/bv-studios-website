import Navigation from '@/components/Navigation'
import { mediaUrls } from '@/constants/mediaUrls'

export default function AboutPage() {
  const team = [
    {
      name: 'Dominic Lewis',
      role: 'Founder & Lead Videographer',
      bio: 'With over 8 years of experience in video production, Dominic brings a unique blend of technical expertise and creative vision to every project.',
      image: mediaUrls.images.team.dominic
    },
    {
      name: 'Deisy Lewis',
      role: 'Creative Director',
      bio: 'Deisy ensures every video tells a compelling story, focusing on emotional connection and brand authenticity.',
      image: mediaUrls.images.team.deisy
    }
  ]

  const stats = [
    { number: '150+', label: 'Videos Produced' },
    { number: '50+', label: 'Happy Clients' },
    { number: '8+', label: 'Years Experience' },
    { number: '100%', label: 'Client Satisfaction' }
  ]

  return (
    <div className="min-h-screen bg-primary">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-primary"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              About
              <span className="text-accent block">BV Studios</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              We're passionate about creating compelling video content that tells your story and drives results.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-lg text-gray-300 mb-6">
                At BV Studios, we believe every business has a unique story worth telling. Our mission is to capture those stories through compelling video content that not only looks beautiful but also drives real business results.
              </p>
              <p className="text-lg text-gray-300 mb-6">
                From intimate wedding ceremonies to high-impact commercial campaigns, we approach each project with the same level of dedication and attention to detail. We're not just videographers – we're storytellers, brand strategists, and creative partners.
              </p>
              <p className="text-lg text-gray-300">
                Based in Lexington, Kentucky, we serve clients throughout the region, bringing professional video production services to businesses and couples who demand excellence.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-accent/20 to-primary rounded-xl overflow-hidden">
                <img
                  src={mediaUrls.images.portfolio.hero}
                  alt="BV Studios at work"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The creative minds behind every BV Studios production
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-accent/20">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">{member.name}</h3>
                <p className="text-accent mb-4">{member.role}</p>
                <p className="text-gray-300">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-accent rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Quality</h3>
              <p className="text-gray-300">
                We never compromise on quality. Every frame, every edit, every detail matters.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-accent rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Creativity</h3>
              <p className="text-gray-300">
                We push creative boundaries to deliver unique, memorable content that stands out.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-accent rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Partnership</h3>
              <p className="text-gray-300">
                We work closely with our clients, treating every project as a true collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Work Together?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Let's discuss your project and bring your vision to life.
            </p>
            <button className="px-8 py-4 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 transition-colors">
              Get In Touch
            </button>
          </div>
        </div>
      </section>
    </div>
  )
} 