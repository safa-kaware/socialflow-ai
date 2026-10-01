import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import HowItWorks from '../components/landing/HowItWorks'
import Features from '../components/landing/Features'
import TechStack from '../components/landing/TechStack'
import Architecture from '../components/landing/Architecture'
import CTA from '../components/landing/CTA'
import Footer from '../components/landing/Footer'

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <TechStack />
        <Architecture />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}