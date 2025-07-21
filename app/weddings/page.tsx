import WeddingPackages from '@/components/WeddingPackages'
import WeddingHero from '@/components/weddings/WeddingHero'
import PersonalStory from '@/components/weddings/PersonalStory'
import ProcessSteps from '@/components/weddings/ProcessSteps'
import WeddingPortfolio from '@/components/weddings/WeddingPortfolio'
import WeddingContact from '@/components/weddings/WeddingContact'

export default function WeddingsPage() {
  return (
    <main className="relative bg-wedding-primary">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,theme(colors.wedding.accent/0.05),transparent_70%)] pointer-events-none" />
      
      {/* Content */}
      <div className="relative">
        <WeddingHero />
        <PersonalStory />
        <ProcessSteps />
        <WeddingPackages />
        <WeddingPortfolio />
        <WeddingContact />
      </div>
    </main>
  )
} 