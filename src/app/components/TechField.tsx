'use client'
import { useEffect, useRef } from 'react'
import { STACK } from '../lib/stack'
import { useScramble } from '../hooks/useScramble'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import { useScrambleOnView } from '../hooks/useScrambleOnView'

const R = 260
const MAX = 105

export default function TechField() {
  const scramble = useScramble()
  const nameRef = useRef<HTMLSpanElement>(null)
  const descRef = useRef<HTMLSpanElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const tileRefs = useRef<(HTMLDivElement | null)[]>([])
  const headingRef = useRef<HTMLSpanElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(revealRef)
  useScrambleOnView(headingRef, 'tools')

  useEffect(() => {
    const tiles = tileRefs.current.filter(Boolean) as HTMLDivElement[]
    if (!tiles.length) return
    const state = tiles.map((el) => ({ el, x: 0, y: 0, tx: 0, ty: 0, s: 1, ts: 1 }))
    let mx = -9999, my = -9999, running = false, last = 0, rafId = 0

    const loop = () => {
      let moving = false
      state.forEach((o) => {
        const r = o.el.getBoundingClientRect()
        const cx = r.left + r.width / 2 - o.x
        const cy = r.top + r.height / 2 - o.y
        const dx = cx - mx, dy = cy - my
        const dist = Math.hypot(dx, dy)
        if (dist < R && dist > 0.001) {
          const f = 1 - dist / R
          const push = MAX * f * f
          o.tx = (dx / dist) * push
          o.ty = (dy / dist) * push
          o.ts = 1 - 0.12 * f
        } else {
          o.tx = 0; o.ty = 0; o.ts = 1
        }
        o.x += (o.tx - o.x) * 0.2
        o.y += (o.ty - o.y) * 0.2
        o.s += (o.ts - o.s) * 0.2
        o.el.style.transform = `translate3d(${o.x.toFixed(2)}px,${o.y.toFixed(2)}px,0) scale(${o.s.toFixed(3)})`
        if (Math.abs(o.tx - o.x) > 0.15 || Math.abs(o.ty - o.y) > 0.15) moving = true
      })
      if (moving || performance.now() - last < 400) rafId = requestAnimationFrame(loop)
      else running = false
    }

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY; last = performance.now()
      if (!running) { running = true; rafId = requestAnimationFrame(loop) }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  const show = (item: (typeof STACK)[number]) => {
    if (nameRef.current) scramble(nameRef.current, item.name, 380)
    if (descRef.current) descRef.current.textContent = item.desc
  }

  return (
    <section id="tech-stack" style={{ position: 'relative', zIndex: 5, background: '#000', padding: '120px 24px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 56 }}>
          <span style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', color: '#6f879c' }}>02 / Stack</span>
          <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }} />
        </div>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(38px, 6vw, 84px)', lineHeight: 0.92, letterSpacing: '-0.025em', margin: '0 0 24px', maxWidth: '22ch' }}>
          The <span ref={headingRef}>tools</span> I reach for.
        </h2>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, minHeight: 58, marginBottom: 48, paddingBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <span ref={nameRef} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 'clamp(22px, 2.6vw, 32px)', lineHeight: 1, flex: 'none', color: '#fff' }}>Hover the field</span>
          <span ref={descRef} style={{ fontWeight: 300, fontSize: 15, lineHeight: 1.45, color: 'rgba(255,255,255,0.4)', maxWidth: '56ch' }}>Everything I work with, loose in one field. Move the cursor through it — or tap any tile.</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingBottom: 22, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: 20, color: '#6f879c', fontWeight: 400 }}>Everything in one field</span>
          <span style={{ fontSize: 11, letterSpacing: '.18em', color: 'rgba(255,255,255,0.3)' }}>55 TOOLS · 9 DISCIPLINES</span>
        </div>

        <div ref={revealRef} style={{ display: 'flex', flexWrap: 'wrap', gap: 14, padding: '34px 0 10px' }}>
          <div ref={gridRef} style={{ display: 'contents' }}>
            {STACK.map((t, i) => {
              const mark = t.name.replace(/[^A-Za-z0-9+#]/g, '').slice(0, 2)
              return (
                <div
                  key={t.name}
                  ref={(el) => { tileRefs.current[i] = el }}
                  data-bubble=""
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.09)'; show(t) }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.035)' }}
                  onClick={() => show(t)}
                  style={{ position: 'relative', width: 122, height: 122, flex: 'none', borderRadius: 16, background: 'rgba(255,255,255,0.035)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, overflow: 'hidden', willChange: 'transform', transition: 'background .5s cubic-bezier(.52,.01,0,1)', cursor: 'pointer' }}
                >
                  <span style={{ position: 'absolute', top: 10, left: 12, fontSize: 8, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(111,135,156,0.7)', pointerEvents: 'none' }}>{t.cat}</span>
                  {t.img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.img} alt={t.name} style={{ width: 36, height: 36, objectFit: 'contain', opacity: 0.9, pointerEvents: 'none' }} />
                  ) : (
                    <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 30, lineHeight: 1, color: 'rgba(255,255,255,0.55)', pointerEvents: 'none' }}>{mark}</span>
                  )}
                  <span style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6f879c', textAlign: 'center', maxWidth: 100, lineHeight: 1.2, pointerEvents: 'none' }}>{t.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
