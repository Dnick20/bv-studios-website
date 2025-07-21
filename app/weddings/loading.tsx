export default function WeddingsLoading() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block relative w-20 h-20">
          <div className="absolute w-full h-full border-4 border-accent/20 rounded-full"></div>
          <div className="absolute w-full h-full border-4 border-accent rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="mt-4 text-white text-lg">Loading...</p>
      </div>
    </div>
  )
} 