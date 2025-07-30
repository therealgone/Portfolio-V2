"use client"

import { useEffect, useRef, useState } from "react"

interface SplineEmbedProps {
  url: string
  className?: string
}

export function SplineEmbed({ url, className = "" }: SplineEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    let script: HTMLScriptElement | null = null
    let viewer: any = null

    const loadSpline = async () => {
      try {
        setIsLoading(true)
        setHasError(false)

        // Check if script already exists
        const existingScript = document.querySelector('script[src*="spline-viewer"]')

        if (!existingScript) {
          script = document.createElement("script")
          script.type = "module"
          script.src = "https://unpkg.com/@splinetool/viewer@latest/build/spline-viewer.js"

          await new Promise((resolve, reject) => {
            script!.onload = resolve
            script!.onerror = reject
            document.head.appendChild(script!)
          })
        }

        // Create viewer element
        viewer = document.createElement("spline-viewer")
        viewer.setAttribute("url", url)
        viewer.setAttribute("loading-anim-type", "spinner-big-dark")

        // Add event listeners
        viewer.addEventListener("load", () => {
          setIsLoading(false)
          console.log("Spline scene loaded successfully")
        })

        viewer.addEventListener("error", (error: any) => {
          console.error("Spline loading error:", error)
          setHasError(true)
          setIsLoading(false)
        })

        container.appendChild(viewer)
      } catch (error) {
        console.error("Failed to load Spline:", error)
        setHasError(true)
        setIsLoading(false)
      }
    }

    loadSpline()

    return () => {
      if (viewer && container.contains(viewer)) {
        container.removeChild(viewer)
      }
      if (script && document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [url])

  const handleRetry = () => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ""
      setIsLoading(true)
      setHasError(false)
      // Re-trigger the effect
      const container = containerRef.current
      const event = new CustomEvent("retry")
      container.dispatchEvent(event)
    }
  }

  return (
    <div className={`relative w-full h-full ${className}`} style={{ minHeight: "400px" }}>
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
            <button onClick={handleRetry} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Spline Container */}
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{
          pointerEvents: isLoading || hasError ? "none" : "auto",
          opacity: isLoading || hasError ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
      />
    </div>
  )
}
