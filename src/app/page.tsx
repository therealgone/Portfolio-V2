import Hero from "./components/Hero_Page"
import Navbar from "./components/navbar"
import About from "./components/about"

export default function Home() {
  return (
    <main>
      <Navbar></Navbar>
      <section className="min-h-screen">
        <Hero></Hero>
      </section>
      <section className="min-h-screen">
        <About></About>
      </section>
    </main>
  );
}
