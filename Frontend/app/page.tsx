import { Navbar } from "../src/components/Navbar"
import { Hero } from "../src/components/Hero"
import { Features } from "../src/components/Features"
import { ChatWidget } from "../src/components/ChatWidget"
import ABDMSection from "../src/components/ABDMSection"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <ABDMSection />
      </main>
      <ChatWidget />
    </div>
  )
}
