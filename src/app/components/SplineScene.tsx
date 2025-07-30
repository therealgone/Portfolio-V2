"use client"

import { SplineEmbed } from "./SplineEmbed"

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className = "" }: SplineSceneProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <SplineEmbed url={scene} className="w-full h-full" />
    </div>
  )
}
