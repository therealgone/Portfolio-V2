import Cursor from './components/Cursor'
import NavIsland from './components/NavIsland'
import Hero from './components/Hero'
import About from './components/About'
import TechField from './components/TechField'
import Projects from './components/Projects'
import Academics from './components/Academics'
import Contact from './components/contact'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main className="text-white">
      <Cursor />
      <NavIsland />
      <Hero />
      <About />
      <TechField />
      <Projects />
      <Academics />
      <Contact />
      <Footer />
    </main>
  )
}
