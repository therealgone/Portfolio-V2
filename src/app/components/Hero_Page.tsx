"use client"

import { motion, easeInOut } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { PrismScene } from "./three/PrismScene"

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
        {/* Interactive 3D Prism Scene */}
        <div className="absolute inset-0 w-full h-full">
          <PrismScene />
        </div>

        {/* Bottom Right Overlay */}
        <div className="absolute bottom-5 right-5 z-[9999] bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
          <span className="text-white text-sm font-medium">Portfolio 2024</span>
        </div>
      </motion.div>
    </main>
  )
}
