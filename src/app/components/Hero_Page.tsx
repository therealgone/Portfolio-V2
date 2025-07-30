"use client"

import { motion, easeInOut } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { PrismScene } from "./three/PrismScene"
import { FaGithub, FaLinkedin } from "react-icons/fa"

export default function HeroPage() {
  const { ref: viewRef, inView } = useInView({
    threshold: 0.1,
  })

  const motionProps90 = {
    initial: { opacity: 0, y: 90 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: easeInOut },
    viewport: { once: true },
  }

  return (
    <main ref={viewRef} className="relative h-screen w-full overflow-hidden">
      <motion.div layout {...motionProps90} className="relative w-full h-full">
        {/* 3D Prism Background */}
        <div className="absolute inset-0 z-999 w-full h-full">
          <PrismScene />
        </div>

        {/* Bottom Right Buttons */}
        <div className="absolute bottom-5 right-5 z-[9999] flex gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">
          <a
            href="https://github.com/therealgone" // <-- Replace with your GitHub
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300 transition duration-200"
          >
            <FaGithub size={22} />
          </a>
          <a
            href="www.linkedin.com/in/jeevan-baabu-97a19125b" // <-- Replace with your LinkedIn
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-300 transition duration-200"
          >
            <FaLinkedin size={22} />
          </a>
        </div>
      </motion.div>
    </main>
  )
}
