"use client"

import { useState } from "react"

interface SplineIframeProps {
  url: string
  className?: string
}

export function SplineIframe({ url, className = "" }: SplineIframeProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    console.log("Spline iframe loaded")
    setIsLoading(false)
  }

  const handleError = () => {
    console.error("Spline iframe failed to load")
    setHasError(true)
    setIsLoading(false)
  }

  // Extract the scene ID from the URL
  const sceneId = url.split("/").find((part) => part.length > 10) || "i7gHz8QTyTOZe0Wz"
  const iframeUrl = `https://my.spline.design/${sceneId}`

  return (
    <div className={`relative w-full h-full ${className}`}>
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

      {/* Spline Iframe */}
      <iframe
        src={iframeUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        onLoad={handleLoad}
        onError={handleError}
        style={{
          opacity: isLoading || hasError ? 0 : 1,
          transition: "opacity 0.5s ease-in-out",
        }}
        allow="camera; microphone; xr-spatial-tracking"
      />
    </div>
  )
}
