'use client';
import Navbar from "./components/navbar"
import Hero from "./components/Hero_Page"
import ElectricCursor from "./components/electric-cursor";
import dynamic from 'next/dynamic';
import { PrismScene } from "./components/three/PrismScene"
import './globals.css'

import { useState, useEffect, useRef, Suspense } from "react";

// Optimized dynamic imports with loading states
const About = dynamic(() => import('./components/about'), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>
})

const Tech = dynamic(() => import('./components/tech-stack'), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>
})

const Project = dynamic(() => import('./components/project'), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>
})

const Contact = dynamic(() => import('./components/contact'), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>
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

    let rafId: number | null = null;
    let pendingActive: string | null = null;

    const updateActive = (next: string) => {
      if (pendingActive === next) return;
      pendingActive = next;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setActive(pendingActive as string);
        rafId = null;
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to viewport top and intersecting
        let best: { id: string; top: number } | null = null;
        for (const entry of entries) {
          const target = entry.target as HTMLElement;
          const id = target.getAttribute('id') || '';
          const rect = target.getBoundingClientRect();
          if (entry.isIntersecting) {
            const top = Math.abs(rect.top);
            if (!best || top < best.top) best = { id, top };
          }
        }
        if (best) updateActive(
          best.id === 'home' ? 'Home' :
          best.id === 'about' ? 'About' :
          best.id === 'tech-stack' ? 'Tech-Stack' :
          best.id === 'project' ? 'Project' :
          best.id === 'contact' ? 'Contact' : 'Home'
        );
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    section.forEach(sec => {
      if (sec.ref.current) observer.observe(sec.ref.current);
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);


  return (



    <main className="scroll-smooth text-white ">

      <div className="absolute inset-0 z-0 ">
        <PrismScene />
      </div>
      <ElectricCursor ></ElectricCursor>



      <Navbar active={active} />


      <section ref={HeroRef} id="home" className="min-h-screen mb-10 md:mb-7">

      </section>
      <section ref={AboutRef} id="about" className="min-h-screen">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>}>
          <About active={active} />
        </Suspense>
      </section>
      <section ref={TechRef} id="tech-stack" className="min-h-screen">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>}>
          <Tech active={active} />
        </Suspense>
      </section>
      <section ref={ProjectRef} id="project" className="min-h-screen pt-6 md:pt-10">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>}>
          <Project active={active} />
        </Suspense>
      </section>
      <section ref={ContactRef} id="contact" className="min-h-screen">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>}>
          <Contact />
        </Suspense>
      </section>

    </main>
  );
}

