"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface SplineWrapperProps {
  scene: string
  onLoad?: () => void
  onError?: (error: any) => void
  style?: React.CSSProperties
}

export function SplineWrapper({ scene, onLoad, onError, style }: SplineWrapperProps) {
  const [SplineComponent, setSplineComponent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSpline = async () => {
      try {
        const { default: Spline } = await import("@splinetool/react-spline/next")
        setSplineComponent(() => Spline)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load Spline component:", error)
        onError?.(error)
        setIsLoading(false)
      }
    }

    loadSpline()
  }, [onError])

  if (isLoading || !SplineComponent) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold mb-4">Loading 3D Experience</h2>
          <p className="text-gray-300">Preparing interactive content...</p>
        </div>
      </div>
    )
  }

  return <SplineComponent scene={scene} onLoad={onLoad} onError={onError} style={style} />
}
