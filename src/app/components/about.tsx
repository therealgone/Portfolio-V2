'use client'
import { useEffect, useRef } from 'react'
import { useScrollEngine } from '../hooks/useScrollEngine'
import { useScramble } from '../hooks/useScramble'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import { useScrambleOnView } from '../hooks/useScrambleOnView'
import RabbitHole from './RabbitHole'

const CHAPTERS = [
  { title: 'I build things', body: <>Successfully completed my <span style={{ color: '#fff' }}>B.Tech in Computer Science Engineering (Artificial Intelligence &amp; Machine Learning)</span> from SRM Institute of Science and Technology with <span style={{ color: '#fff' }}>First Class with Distinction</span>. My work sits across machine learning, web development and software engineering. I enjoy turning ideas into real, working products — and learning whatever is needed to make them happen.</> },
  { title: 'Exploring beyond my field', body: <>I don&apos;t like limiting myself to what I already know. I&apos;ll get my hands dirty with <span style={{ color: '#fff' }}>app development, game development, cloud technologies, creative tools</span> and other areas outside my core expertise — even when I&apos;m still a beginner. For me the goal isn&apos;t to know everything; it&apos;s to keep learning by actually building.</> },
  { title: 'I learn by doing', body: <>Rather than waiting until I&apos;m &quot;good enough&quot; to start something, I prefer jumping in, experimenting, breaking things and figuring them out along the way. Every project gives me a new skill, a new perspective, or sometimes just a <span style={{ color: '#fff' }}>really interesting problem to solve</span>.</> },
  { title: 'Always building', body: <>I&apos;m interested in the intersection of <span style={{ color: '#fff' }}>AI, software, creativity and product development</span>. Whether it&apos;s a web app, an AI system, a mobile app or a game — if an idea excites me, I want to build it.</> },
]
const TICK_LABELS = ['I build things', 'Beyond my field', 'I learn by doing', 'Always building']

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

export default function About() {
  const { subscribe } = useScrollEngine()
  const scramble = useScramble()
  const headingRef = useRef<HTMLSpanElement>(null)
  useScrambleOnView(headingRef, 'build')

  const trackWrapRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])
  const countRef = useRef<HTMLSpanElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const tickRefs = useRef<(HTMLButtonElement | null)[]>([])
  const tickLineRefs = useRef<(HTMLSpanElement | null)[]>([])
  const chapterIndexRef = useRef(-1)

  const h2Ref = useRef<HTMLHeadingElement>(null)
  useRevealOnScroll(h2Ref)

  useEffect(() => {
    return subscribe(() => {
      const track = trackWrapRef.current
      const rail = railRef.current
      if (!track || !rail) return
      const vh = window.innerHeight
      const panels = panelRefs.current.filter(Boolean) as HTMLDivElement[]
      const total = track.offsetHeight - vh
      const p = clamp(-track.getBoundingClientRect().top / total, 0, 1)
      const n = panels.length
      const step = n > 1 ? panels[1].offsetLeft - panels[0].offsetLeft : 0
      const dist = step * (n - 1)
      rail.style.transform = `translate3d(${(-p * dist).toFixed(1)}px,0,0)`

      const pos = p * (n - 1)
      let nearest = 0, nd = Infinity
      panels.forEach((el, i) => {
        const off = Math.abs(pos - i)
        const f = clamp(1 - off, 0, 1)
        const e = f * f
        el.style.opacity = (0.2 + 0.8 * e).toFixed(3)
        el.style.transform = `scale(${(0.93 + 0.07 * e).toFixed(3)})`
        el.style.filter = f > 0.985 ? 'none' : `blur(${((1 - e) * 3.5).toFixed(1)}px)`
        if (off < nd) { nd = off; nearest = i }
      })

      if (nearest !== chapterIndexRef.current) {
        chapterIndexRef.current = nearest
        if (countRef.current) scramble(countRef.current, ('0' + (nearest + 1)).slice(-2), 340)
        if (labelRef.current) scramble(labelRef.current, CHAPTERS[nearest].title, 420)
        tickRefs.current.forEach((btn, i) => {
          if (!btn) return
          const on = i === nearest
          btn.style.color = on ? '#fff' : 'rgba(255,255,255,0.32)'
          const line = tickLineRefs.current[i]
          if (line) { line.style.width = on ? '56px' : '26px'; line.style.background = on ? '#fff' : 'rgba(255,255,255,0.25)' }
        })
      }
    })
  }, [subscribe, scramble])

  const jumpTo = (i: number) => {
    const track = trackWrapRef.current
    if (!track) return
    const n = CHAPTERS.length
    const total = track.offsetHeight - window.innerHeight
    const top = track.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + total * (i / (n - 1)), behavior: 'smooth' })
  }

  return (
    <section id="about" style={{ position: 'relative', zIndex: 5, background: '#000', padding: '120px 24px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 56 }}>
          <span style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', color: '#6f879c' }}>01 / About</span>
          <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }} />
        </div>
        <h2 ref={h2Ref} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(38px, 6vw, 84px)', lineHeight: 0.92, letterSpacing: '-0.025em', margin: '0 0 24px', maxWidth: '20ch' }}>
          I <span ref={headingRef}>build</span> things.
        </h2>
        <p style={{ margin: 0, fontWeight: 300, fontSize: 16, color: 'rgba(255,255,255,0.45)', maxWidth: '40ch' }}>Four chapters, read sideways. Scroll — or jump to one below.</p>
      </div>

      <div ref={trackWrapRef} data-track-wrap="" style={{ position: 'relative', height: '420vh' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, padding: '0 max(24px, calc((100vw - 1200px) / 2)) 34px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
              <span ref={countRef} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 'clamp(30px, 4vw, 52px)', lineHeight: 1 }}>01</span>
              <span ref={labelRef} style={{ fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', color: '#6f879c' }}>I build things</span>
            </div>
          </div>

          <div ref={railRef} style={{ display: 'flex', gap: 28, paddingLeft: 'calc(50vw - min(300px, 40vw))', paddingRight: 'calc(50vw - min(300px, 40vw))', willChange: 'transform' }}>
            {CHAPTERS.map((ch, i) => (
              <div
                key={ch.title}
                ref={(el) => { panelRefs.current[i] = el }}
                data-chapter=""
                style={{ flex: 'none', boxSizing: 'border-box', width: 'min(600px, 80vw)', borderRadius: 24, padding: '44px 40px', background: 'rgba(255,255,255,0.035)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12)', display: 'flex', flexDirection: 'column', gap: 22, willChange: 'transform, opacity', transition: 'background .5s cubic-bezier(.52,.01,0,1)' }}
              >
                <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 68, lineHeight: 0.8, color: 'rgba(255,255,255,0.16)' }}>{('0' + (i + 1)).slice(-2)}</span>
                <span style={{ fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', color: '#6f879c' }}>{ch.title}</span>
                <p style={{ margin: 0, fontWeight: 300, fontSize: 'clamp(17px, 1.8vw, 21px)', lineHeight: 1.5, color: 'rgba(255,255,255,0.8)' }}>{ch.body}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap', padding: '40px max(24px, calc((100vw - 1200px) / 2)) 0' }}>
            {TICK_LABELS.map((label, i) => (
              <button
                key={label}
                ref={(el) => { tickRefs.current[i] = el }}
                type="button"
                onClick={() => jumpTo(i)}
                style={{ border: 'none', background: 'transparent', padding: '12px 0', display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.32)', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', transition: 'color .5s cubic-bezier(.52,.01,0,1)', cursor: 'pointer' }}
              >
                <span ref={(el) => { tickLineRefs.current[i] = el }} style={{ display: 'block', width: 26, height: 1, background: 'rgba(255,255,255,0.25)', transition: 'width .5s cubic-bezier(.52,.01,0,1), background .5s cubic-bezier(.52,.01,0,1)' }} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <RabbitHole />
    </section>
  )
}
