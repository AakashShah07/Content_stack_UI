import { Hero } from "@/components/hero"
import { Dashboard } from "@/components/dashboard"

export default function HomePage() {
  return (
    <main className="min-h-screen animated-gradient">
      <Hero />
      <Dashboard />
    </main>
  )
}
