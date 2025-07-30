"use client"

import { useEffect, useRef } from "react"

interface SplineEmbedProps {
  url: string
  className?: string
}

export function SplineEmbed({ url, className = "" }: SplineEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      const script = document.createElement("script")
      script.type = "module"
      script.src = "https://unpkg.com/@splinetool/viewer@0.9.507/build/spline-viewer.js"

      const viewer = document.createElement("spline-viewer")
      viewer.setAttribute("url", url)
      viewer.setAttribute("loading-anim-type", "spinner-big-dark")

      containerRef.current.appendChild(viewer)
      document.head.appendChild(script)

      return () => {
        if (containerRef.current) {
          containerRef.current.innerHTML = ""
        }
        document.head.removeChild(script)
      }
    }
  }, [url])

  return <div ref={containerRef} className={`w-full h-full ${className}`} style={{ minHeight: "400px" }} />
}
