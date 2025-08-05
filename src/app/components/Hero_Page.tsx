"use client"


import { useInView } from "react-intersection-observer"
import { PrismScene } from "./three/PrismScene"
import { FaGithub, FaLinkedin } from "react-icons/fa"

export default function HeroPage() {
  const { ref: viewRef, inView } = useInView({
    threshold: 0.1,
  })



  return (
    <main ref={viewRef} className="relative h-screen w-full ">
      <div  className="relative w-full h-full">
        {/* 3D Prism Background */}
        <div className=" z-[999] w-full h-full ">
          <PrismScene />
        </div>

      
      </div>
    </main>
  )
}
