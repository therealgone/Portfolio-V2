'use client'
import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring || window.matchMedia('(max-width: 899px)').matches) return

    let tx = -100, ty = -100, rx = -100, ry = -100, running = false
    let rafId: number

    const loop = () => {
      rx += (tx - rx) * 0.16
      ry += (ty - ry) * 0.16
      dot.style.transform = `translate3d(${tx - 3}px,${ty - 3}px,0)`
      ring.style.transform = `translate3d(${rx}px,${ry}px,0)`
      if (Math.abs(tx - rx) > 0.4 || Math.abs(ty - ry) > 0.4) {
        rafId = requestAnimationFrame(loop)
      } else {
        running = false
      }
    }

    const onMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
      const t = e.target as HTMLElement | null
      const interactive = t?.closest?.('a,button,input,textarea,[data-island],[data-row]')
      ring.style.width = interactive ? '56px' : '34px'
      ring.style.height = interactive ? '56px' : '34px'
      ring.style.margin = interactive ? '-28px 0 0 -28px' : '-17px 0 0 -17px'
      if (!running) {
        running = true
        rafId = requestAnimationFrame(loop)
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0, width: 6, height: 6, borderRadius: 999,
          background: '#fff', zIndex: 100000, pointerEvents: 'none',
          transform: 'translate3d(-100px,-100px,0)', mixBlendMode: 'difference',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed', top: 0, left: 0, width: 34, height: 34, margin: '-17px 0 0 -17px',
          borderRadius: 999, border: '1px solid rgba(255,255,255,0.35)', zIndex: 99999,
          pointerEvents: 'none', transform: 'translate3d(-100px,-100px,0)',
          transition: 'width .25s ease, height .25s ease, opacity .25s ease',
        }}
      />
    </>
  )
}
