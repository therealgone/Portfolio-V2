'use client';
import Navbar from "./components/navbar"
import Hero from "./components/Hero_Page"
import About from "./components/about"
import Tech from "./components/tech-stack"
import Project from "./components/project"
import Contact from "./components/contact"

import { useState, useEffect, useRef } from "react";


export default function Home() {
  const HeroRef = useRef(null);
  const AboutRef = useRef(null);
  const TechRef = useRef(null);
  const ProjectRef = useRef(null);
  const ContactRef = useRef(null);

  const [active,setActive] = useState("")

  useEffect ( () => {

    const section = [
      {id:"Home",ref:HeroRef}, 
      {id:"About",ref:AboutRef},
      {id:"Tech",ref:TechRef},
      {id:"Project",ref:ProjectRef},
      {id:"Contact",ref:ContactRef},
    ];

    
     
    const obs = new IntersectionObserver (

      (dom) => { dom.forEach((view) =>{

        if (view.isIntersecting)
        {
          const page= section.find(sec => sec.ref.current === view.target)

          
          if(page)
          {
            setActive(page.id)
          }
        }



      });






      },
      { threshold: 0.6}
    );
    section.forEach(({ref}) => {
      if (ref.current) obs.observe(ref.current);
    
    })

    return () => {
      section.forEach(({ref}) => {
        if(ref.current) obs.observe(ref.current);
      });
    };




  }, []);


  return (



    <main>
      <Navbar active={active} />
      <section ref={HeroRef} className="min-h-screen">
        <Hero></Hero>
      </section>
      <section ref={AboutRef} className="min-h-screen">
        <About></About>
      </section>
      <section ref={TechRef} className="min-h-screen">
        <Tech></Tech>
      </section>
      <section ref={ProjectRef} className="min-h-screen">
        <Project></Project>
      </section>
      <section ref={ContactRef} className="min-h-screen">
        <Contact></Contact>
      </section>
    </main>
  );
}
