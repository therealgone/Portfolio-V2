'use client';
import Navbar from "./components/navbar"
import Hero from "./components/Hero_Page"
import ElectricCursor from "./components/electric-cursor";
import dynamic from 'next/dynamic';

import { useState, useEffect, useRef } from "react";

const About = dynamic(() => import('./components/about'), {
  ssr: false,
})

const Tech = dynamic(() => import('./components/tech-stack'), {

  ssr: false,
})

const Project = dynamic(() => import('./components/project'), {

  ssr: false,
})

const Contact = dynamic(() => import('./components/contact'), {

  ssr: false,
})





export default function Home() {
  const HeroRef = useRef<HTMLElement | null>(null);
  const AboutRef = useRef<HTMLElement | null>(null);
  const TechRef = useRef<HTMLElement | null>(null);
  const ProjectRef = useRef<HTMLElement | null>(null);
  const ContactRef = useRef<HTMLElement | null>(null);


  const [active, setActive] = useState("")

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    const section = [
      { id: "Home", ref: HeroRef },
      { id: "About", ref: AboutRef },
      { id: "Tech-Stack", ref: TechRef },
      { id: "Project", ref: ProjectRef },
      { id: "Contact", ref: ContactRef },
    ];

    function onScroll() {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      let closestSection = section[0];
      let minDistance = Infinity;
      section.forEach(sec => {
        if (sec.ref.current) {
          const rect = sec.ref.current.getBoundingClientRect();
          const distance = Math.abs(rect.top);
          // Only consider sections that are above or near the top
          if (rect.top <= viewportHeight * 0.3 && distance < minDistance) {
            minDistance = distance;
            closestSection = sec;
          }
        }
      });
      setActive(closestSection.id);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Run once on mount
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);


  return (



    <main className="scroll-smooth text-white">
      <>

        <ElectricCursor></ElectricCursor>
      </>


      <Navbar active={active} />
      <section ref={HeroRef} id="home" className="min-h-screen">
        <Hero />
      </section>
      <section ref={AboutRef} id="about" className="min-h-screen">
        <About active={active} />
      </section>
      <section ref={TechRef} id="tech-stack" className="min-h-screen">
        <Tech active={active} />
      </section>
      <section ref={ProjectRef} id="project" className="min-h-screen pt-10">
        <Project active={active} />
      </section>
      <section ref={ContactRef} id="contact" className="min-h-screen">
        <Contact  />
      </section>
    </main>
  );
}

