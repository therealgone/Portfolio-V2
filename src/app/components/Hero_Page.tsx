"use client"

import { motion, easeInOut } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useState, Suspense } from "react"
import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false });

export default function HeroPage() {
  const { ref: viewRef, inView } = useInView({
    threshold: 0.1,
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
    console.log("Spline scene loaded successfully")
    setIsLoading(false)
  }

  const handleSplineError = (error: any) => {
    console.error("Spline loading error:", error)
    setHasError(true)
    setIsLoading(false)
  }

  const handleRetry = () => {
    setHasError(false)
    setIsLoading(true)
    // Force re-render by reloading the page
    window.location.reload()
  }

  const handleSkipLoading = () => {
    setIsLoading(false)
  }

  return (
    <main ref={viewRef} className="relative h-screen w-full overflow-hidden">
      <motion.div layout {...motionProps90} className="relative w-full h-full">
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700">
            <div className="text-center text-white max-w-md">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold mb-4">Loading 3D Experience</h2>
              <p className="text-gray-300 mb-6">Preparing interactive content...</p>
              <button
                onClick={handleSkipLoading}
                className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors"
              >
                Continue to Portfolio
              </button>
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-br from-red-900 to-gray-900">
            <div className="text-center text-white max-w-md">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <h2 className="text-2xl font-bold mb-4">3D Content Unavailable</h2>
              <p className="text-gray-300 mb-6">The interactive 3D scene couldn't load.</p>
              <div className="space-x-3">
                <button
                  onClick={handleRetry}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                >
                  Try Again
                </button>
                <button
                  onClick={handleSkipLoading}
                  className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30"
                >
                  Continue Anyway
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Spline Scene */}
        <div className="absolute inset-0 w-full h-full">
          <Suspense
            fallback={
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-6"></div>
                  <h2 className="text-2xl font-bold mb-4">Loading 3D Experience</h2>
                  <p className="text-gray-300">Preparing interactive content...</p>
                </div>
              </div>
            }
          >
            <Spline
              scene="https://prod.spline.design/i7gHz8QTyTOZe0Wz/scene.splinecode"
              onLoad={handleSplineLoad}
              onError={handleSplineError}
              style={{
                width: "100%",
                height: "100%",
                opacity: isLoading || hasError ? 0 : 1,
                transition: "opacity 0.5s ease-in-out",
                pointerEvents: isLoading || hasError ? "none" : "auto",
              }}
            />
          </Suspense>
        </div>

        {/* Fallback Hero Content - only show when not loading and no error */}
        {!isLoading && !hasError && (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center pointer-events-none opacity-0">
            <div className="text-center text-white z-10">
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Welcome
              </h1>
              <p className="text-2xl text-gray-300 mb-4">to my interactive portfolio</p>
              <p className="text-lg text-gray-400">Scroll down to explore my work</p>
            </div>
          </div>
        )}

        {/* Bottom Right Overlay */}
        <div className="absolute bottom-5 right-5 z-[9999] bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
          <span className="text-white text-sm font-medium">Portfolio 2024</span>
        </div>
      </motion.div>
    </main>
  )
}
