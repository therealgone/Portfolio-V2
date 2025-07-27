'use client';
import Navbar from "./components/navbar"
import Hero from "./components/Hero_Page"
import ElectricCursor from "./components/electric-cursor";
import dynamic from 'next/dynamic';

import { useState, useEffect, useRef } from "react";

 const About = dynamic(()=> import('./components/about') , {
  ssr:false,
 })

 const Tech = dynamic(() => import ('./components/tech-stack'), {

  ssr:false,
 })

 const Project = dynamic(() => import ('./components/project'), {

  ssr:false,
 })

 const Contact = dynamic(() => import ('./components/contact'), {

  ssr:false,
 })





export default function Home() {
  const HeroRef = useRef(null);
  const AboutRef = useRef(null);
  const TechRef = useRef(null);
  const ProjectRef = useRef(null);
  const ContactRef = useRef(null);


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

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const page = section.find(sec => sec.ref.current === entry.target);
            if (page) {
              setActive(page.id);
            }
          }
        });
      },
      { threshold: 0.3, rootMargin: '-10% 0px -10% 0px' }
    );

    section.forEach(({ ref }) => {
      if (ref.current) {
        obs.observe(ref.current);
      }
    });

    return () => {
      section.forEach(({ ref }) => {
        if (ref.current) {
          obs.unobserve(ref.current);
        }
      });
    };
  }, []);


  return (



    <main className="scroll-smooth">
      <>

        <ElectricCursor></ElectricCursor>
      </>


      <Navbar active={active} />
      <section ref={HeroRef} className="min-h-screen">
        <Hero ></Hero>
      </section>
      <section ref={AboutRef} className="min-h-screen">
        <About active={active}></About>
      </section>
      <section ref={TechRef} className="min-h-screen">
        <Tech active={active}></Tech>
      </section>
      <section ref={ProjectRef} className="min-h-screen">
        <Project active={active} ></Project>
      </section>
      <section ref={ContactRef} className="min-h-screen">
        <Contact active={active}></Contact>
      </section>
    </main>
  );
}
