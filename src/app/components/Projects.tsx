'use client'
import { useEffect, useRef, useState } from 'react'
import { PROJECTS } from '../lib/projects'
import { useScrollEngine } from '../hooks/useScrollEngine'
import { useScramble } from '../hooks/useScramble'

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const FALLBACK_IMG = 'https://placehold.co/920x600/111214/6f879c?text=Project'

export default function Projects() {
  const { subscribe } = useScrollEngine()
  const scramble = useScramble()
  const wrapRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const barRefs = useRef<(HTMLSpanElement | null)[]>([])
  const arrowRefs = useRef<(HTMLSpanElement | null)[]>([])
  const shotRefs = useRef<(HTMLDivElement | null)[]>([])
  const numRef = useRef<HTMLSpanElement>(null)
  const tagRef = useRef<HTMLSpanElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const stackRef = useRef<HTMLParagraphElement>(null)

  const scrollIndexRef = useRef(0)
  const hoverIndexRef = useRef<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const setShot = (i: number) => {
    shotRefs.current.forEach((el, k) => {
      if (!el) return
      const on = k === i
      el.style.opacity = on ? '1' : '0'
      el.style.clipPath = on ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)'
      el.style.zIndex = on ? '2' : '1'
    })
    rowRefs.current.forEach((el, k) => {
      if (!el) return
      const on = k === i
      el.style.color = on ? '#fff' : 'rgba(255,255,255,0.3)'
      const arrow = arrowRefs.current[k]
      if (arrow) arrow.style.opacity = on ? '1' : '0'
      const bar = barRefs.current[k]
      if (bar && k !== hoverIndexRef.current) bar.style.width = on ? '100%' : '0%'
    })
    const p = PROJECTS[i]
    if (stackRef.current) stackRef.current.textContent = p ? p.stack : 'New builds land here as they ship'
    if (p) {
      if (numRef.current) numRef.current.textContent = p.num
      if (tagRef.current) scramble(tagRef.current, p.tag, 360)
      if (titleRef.current) scramble(titleRef.current, p.title, 460)
      if (descRef.current) descRef.current.textContent = p.desc
    } else {
      if (numRef.current) numRef.current.textContent = '11'
      if (tagRef.current) scramble(tagRef.current, 'Next up', 360)
      if (titleRef.current) scramble(titleRef.current, 'More coming soon', 440)
      if (descRef.current) descRef.current.textContent = 'New builds land here as they ship — web, ML and the occasional game experiment.'
    }
  }

  useEffect(() => { setShot(0) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // desktop: scroll-progress drives the active index
  useEffect(() => {
    return subscribe(() => {
      if (isMobile) return
      const wrap = wrapRef.current
      if (!wrap) return
      const vh = window.innerHeight
      const n = PROJECTS.length + 1
      const total = wrap.offsetHeight - vh
      if (total <= 0) return // guard: layout not settled yet (source lines 421 comment)
      const p = clamp(-wrap.getBoundingClientRect().top / total, 0, 1)
      const act = clamp(Math.floor(p * n), 0, n - 1)
      if (act !== scrollIndexRef.current) {
        scrollIndexRef.current = act
        if (hoverIndexRef.current == null) setShot(act)
      }
    })
  }, [subscribe, isMobile]) // eslint-disable-line react-hooks/exhaustive-deps

  // mobile: nearest-row-to-viewport-middle drives the active index; desktop and
  // mobile drivers are mutually exclusive (source's syncMode/§8 "two drivers, never both")
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(max-width: 780px)').matches)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!isMobile) return
    const rows = rowRefs.current.filter(Boolean) as HTMLAnchorElement[]
    const io = new IntersectionObserver((entries) => {
      let best: IntersectionObserverEntry | null = null
      entries.forEach((en) => {
        if (!en.isIntersecting) return
        if (!best || en.intersectionRatio > best.intersectionRatio) best = en
      })
      if (best) {
        const i = rows.indexOf(best.target as HTMLAnchorElement)
        if (i > -1 && i !== scrollIndexRef.current) {
          scrollIndexRef.current = i
          setShot(i)
        }
      }
    }, { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.5, 1] })
    rows.forEach((r) => io.observe(r))
    return () => io.disconnect()
  }, [isMobile]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.querySelectorAll<HTMLImageElement>('[data-proj-img]').forEach((img) => {
      const fail = () => { if (img.src !== FALLBACK_IMG) img.src = FALLBACK_IMG }
      img.addEventListener('error', fail)
      if (img.complete && img.naturalWidth === 0) fail()
    })
  }, [])

  return (
    <section id="project" style={{ position: 'relative', zIndex: 5, background: '#000', padding: '120px 24px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 56 }}>
          <span style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', color: '#6f879c' }}>03 / Work</span>
          <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }} />
        </div>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(38px, 6vw, 84px)', lineHeight: 0.92, letterSpacing: '-0.025em', margin: '0 0 24px', maxWidth: '20ch' }}>Ten builds, one at a time.</h2>
        <p style={{ margin: '0 0 8px', fontWeight: 300, fontSize: 16, color: 'rgba(255,255,255,0.45)', maxWidth: '44ch' }}>Ten builds. Scroll the index — the preview follows. Hover to peek, click to open the repo.</p>
      </div>

      <div ref={wrapRef} data-index-wrap="" style={{ position: 'relative', height: '900vh', marginTop: 48 }}>
        <div data-index-sticky="" style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <div data-index-grid="" style={{ width: '100%', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 0.86fr) minmax(0, 1.14fr)', gap: 48, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {PROJECTS.map((p, i) => (
                <ProjectRow
                  key={p.num}
                  p={p}
                  onEnter={() => { hoverIndexRef.current = i; setShot(i) }}
                  onLeave={() => { hoverIndexRef.current = null; setShot(scrollIndexRef.current) }}
                  rowRef={(el) => { rowRefs.current[i] = el }}
                  barRef={(el) => { barRefs.current[i] = el }}
                  arrowRef={(el) => { arrowRefs.current[i] = el }}
                />
              ))}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, padding: 'min(16px, 1.5vh) 4px', color: 'rgba(255,255,255,0.3)' }}>
                <span style={{ fontSize: 11, letterSpacing: '.16em', color: '#6f879c', flex: 'none' }}>11</span>
                <span style={{ fontSize: 'clamp(14px, min(1.5vw, 2vh), 19px)' }}>More coming soon</span>
              </div>
            </div>

            <div data-index-preview="" style={{ position: 'relative', width: '100%' }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 10.5', maxHeight: '72vh', borderRadius: 20, overflow: 'hidden', background: '#0a0a0b', boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 20px 25px -5px rgba(0,0,0,0.6)' }}>
                {PROJECTS.map((p, i) => (
                  <div key={p.num} ref={(el) => { shotRefs.current[i] = el }} style={{ position: 'absolute', inset: 0, opacity: 0, clipPath: 'inset(0 0 100% 0)', transition: 'opacity .6s cubic-bezier(.52,.01,0,1), clip-path .7s cubic-bezier(.52,.01,0,1)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img data-proj-img="" src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                ))}
                <div ref={(el) => { shotRefs.current[PROJECTS.length] = el }} style={{ position: 'absolute', inset: 0, opacity: 0, clipPath: 'inset(0 0 100% 0)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 20, transition: 'opacity .6s cubic-bezier(.52,.01,0,1), clip-path .7s cubic-bezier(.52,.01,0,1)' }}>
                  <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 'clamp(24px, 3vw, 40px)', color: 'rgba(255,255,255,0.6)' }}>In the workshop</span>
                </div>
              </div>
              <div style={{ paddingTop: 22, minHeight: 116 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 8 }}>
                  <span ref={numRef} style={{ fontSize: 11, letterSpacing: '.18em', color: '#6f879c' }}>01</span>
                  <span ref={tagRef} style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: '#6f879c' }}>IoT · Edge–Cloud · Research</span>
                </div>
                <h3 ref={titleRef} style={{ margin: '0 0 8px', fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(22px, 2.6vw, 34px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}>EdgeSign</h3>
                <p ref={descRef} style={{ margin: '0 0 12px', fontWeight: 300, fontSize: 15, lineHeight: 1.5, color: 'rgba(255,255,255,0.55)', maxWidth: '60ch' }}>Real-time sign language translation on a Raspberry Pi 4 — 21 MediaPipe landmarks per frame, AI sentence generation instead of isolated words, and on-device text-to-speech.</p>
                <p ref={stackRef} style={{ margin: 0, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(111,135,156,0.85)' }}>Python · Raspberry Pi · MediaPipe · OpenCV · TensorFlow · Flask</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectRow({ p, onEnter, onLeave, rowRef, barRef, arrowRef }: {
  p: (typeof PROJECTS)[number]
  onEnter: () => void
  onLeave: () => void
  rowRef: (el: HTMLAnchorElement | null) => void
  barRef: (el: HTMLSpanElement | null) => void
  arrowRef: (el: HTMLSpanElement | null) => void
}) {
  const titleRef = useRef<HTMLSpanElement>(null)
  const scramble = useScramble()
  return (
    <a
      ref={rowRef}
      href={p.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => { onEnter(); if (titleRef.current) scramble(titleRef.current, p.title, 420) }}
      onMouseLeave={onLeave}
      style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'baseline', gap: 16, padding: 'min(16px, 1.5vh) 4px', borderBottom: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)', transition: 'color .5s cubic-bezier(.52,.01,0,1)' }}
    >
      <span ref={barRef} style={{ position: 'absolute', left: 0, top: 0, height: 1, width: '0%', background: '#fff', transition: 'width .5s cubic-bezier(.52,.01,0,1)' }} />
      <span style={{ fontSize: 11, letterSpacing: '.16em', color: '#6f879c', flex: 'none' }}>{p.num}</span>
      <span ref={titleRef} style={{ fontSize: 'clamp(14px, min(1.5vw, 2vh), 19px)', lineHeight: 1.25 }}>{p.title}</span>
      <span ref={arrowRef} style={{ marginLeft: 'auto', fontSize: 13, opacity: 0, transition: 'opacity .5s cubic-bezier(.52,.01,0,1)' }}>↗</span>
    </a>
  )
}
