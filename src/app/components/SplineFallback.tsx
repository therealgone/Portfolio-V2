"use client"

export function SplineFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700">
      <div className="text-center text-white">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 animate-pulse"></div>
        </div>
        <h2 className="text-2xl font-bold mb-2">3D Experience</h2>
        <p className="text-gray-300">Interactive content loading...</p>
      </div>
    </div>
  )
}
