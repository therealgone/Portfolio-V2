"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

// Dynamically import Spline to avoid SSR issues
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
})

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className = "" }: SplineSceneProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading 3D Scene...</p>
            </div>
          </div>
        }
      >
        <Spline
          scene={scene}
          onLoad={() => console.log("Spline scene loaded")}
          onError={(error) => console.error("Spline error:", error)}
        />
      </Suspense>
    </div>
  )
}
