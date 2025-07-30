"use client"

import { motion, easeInOut } from "framer-motion"
import { useState } from "react"
import { useInView } from "react-intersection-observer"
import Spline from "@splinetool/react-spline"

export default function HeroPage() {
  const { ref: viewRef, inView } = useInView({
    threshold: 0.1, // trigger when 10% visible
  })

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const motionProps90 = {
    initial: { opacity: 0, y: 90 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: easeInOut },
    viewport: { once: true },
  }

  const handleSplineLoad = () => {
    setIsLoading(false)
    console.log("Spline scene loaded successfully")
  }

  const handleSplineError = (error: any) => {
    console.error("Spline loading error:", error)
    setHasError(true)
    setIsLoading(false)
  }

  return (
    <main ref={viewRef} className="relative h-screen w-full overflow-hidden">
      <motion.div layout {...motionProps90} className="relative w-full h-full">
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading 3D Scene...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Failed to load 3D scene</p>
              <button
                onClick={() => {
                  setHasError(false)
                  setIsLoading(true)
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Spline Scene */}
        <div className="absolute inset-0 w-full h-full">
          <Spline
            scene="https://prod.spline.design/i7gHz8QTyTOZe0Wz/scene.splinecode"
            onLoad={handleSplineLoad}
            onError={handleSplineError}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>

        {/* Bottom Right Overlay */}
        <div className="absolute bottom-5 right-5 z-[9999] bg-black w-[140px] h-[50px] rounded">
          {/* Add your content here */}
        </div>
      </motion.div>
    </main>
  )
}
