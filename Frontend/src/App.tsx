import { Navbar } from "./components/Navbar"
import { Hero } from "./components/Hero"
import { Features } from "./components/Features"
import { ChatWidget } from "./components/ChatWidget"

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
      <ChatWidget />
    </div>
  )
}
