'use client'; 
import Navbar from "./components/navbar"
import Hero from "./components/Hero_Page"
import About from "./components/about"
import  Tech from "./components/tech-stack"
import  Project from "./components/project"
import Contact from "./components/contact"

import { useState , useEffect, useRef } from "react";


export default function Home() {
 const heroref = useRef(null);
  
  return (

    
   
   <main>
      <Navbar></Navbar>
      <section className="min-h-screen">
        <Hero></Hero>
      </section>
      <section className="min-h-screen">
        <About></About>
      </section>
      <section className="min-h-screen">
        <Tech></Tech>
      </section>
      <section className="min-h-screen">
        <Project></Project>
      </section>
      <section className="min-h-screen">
        <Contact></Contact>
      </section>
    </main>
  );
}
