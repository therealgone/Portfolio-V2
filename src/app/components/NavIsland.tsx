'use client'
import { useEffect, useRef, useState } from 'react'
import { useScrollEngine } from '../hooks/useScrollEngine'
import { useScramble } from '../hooks/useScramble'

const SECTION_IDS = ['home', 'about', 'tech-stack', 'project', 'credentials', 'contact'] as const
const SECTION_LABELS: Record<(typeof SECTION_IDS)[number], string> = {
  home: 'Home', about: 'About', 'tech-stack': 'Tech Stack',
  project: 'Projects', credentials: 'Academics', contact: 'Contact',
}

const NAV_ROWS = [
  { num: '01', href: '#home', label: 'Home' },
  { num: '02', href: '#about', label: 'About' },
  { num: '03', href: '#tech-stack', label: 'Tech Stack' },
  { num: '04', href: '#project', label: 'Projects' },
  { num: '05', href: '#credentials', label: 'Academics' },
  { num: '06', href: '#contact', label: 'Contact' },
]

export default function NavIsland() {
  const [navOpen, setNavOpen] = useState(false)
  const [activeLabel, setActiveLabel] = useState('Home')
  const { subscribe } = useScrollEngine()
  const scramble = useScramble()
  const islandRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const activeRef = useRef('Home')

  useEffect(() => {
    return subscribe(() => {
      const vh = window.innerHeight
      let best: (typeof SECTION_IDS)[number] = 'home'
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= vh * 0.35) best = id
      })
      const label = SECTION_LABELS[best]
      if (label !== activeRef.current) {
        activeRef.current = label
        setActiveLabel(label)
        if (labelRef.current) scramble(labelRef.current, label, 420)
      }
    })
  }, [subscribe, scramble])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setNavOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <div style={{ position: 'fixed', top: 22, left: 0, right: 0, zIndex: 9000, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
        <div
          ref={islandRef}
          data-island=""
          className="glass"
          onClick={() => setNavOpen((v) => !v)}
          onMouseEnter={() => { if (islandRef.current) islandRef.current.style.transform = 'scale(1.04)' }}
          onMouseLeave={() => { if (islandRef.current) islandRef.current.style.transform = '' }}
          style={{
            pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 12, height: 44,
            padding: '0 8px 0 16px', borderRadius: 999, transition: 'transform .5s cubic-bezier(.2,.9,.2,1)',
            cursor: 'pointer',
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: 999, background: '#fff', boxShadow: '0 0 8px rgba(255,255,255,0.9)', flex: 'none' }} />
          <span ref={labelRef} style={{ fontSize: 13, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.92)', minWidth: 82, textAlign: 'center', fontWeight: 400 }}>
            {activeLabel}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 999, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)', fontSize: 11, letterSpacing: '.1em' }}>
            {navOpen ? '×' : '⌘'}
          </span>
        </div>
      </div>

      {navOpen && (
        <div
          onClick={() => setNavOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 9500, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '88px 20px 20px' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass"
            style={{ width: '100%', maxWidth: 520, borderRadius: 24, padding: 10, background: 'rgba(255,255,255,0.02)', boxShadow: '4px 4px 24px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.15)' }}
          >
            <div style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: '#6f879c' }}>Navigate</span>
              <span style={{ fontSize: 11, letterSpacing: '.14em', color: 'rgba(255,255,255,0.35)' }}>ESC</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {NAV_ROWS.map((row) => (
                <NavRow key={row.num} {...row} onNavigate={() => setNavOpen(false)} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 20, padding: '18px 16px 14px', marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <a href="https://github.com/therealgone" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, letterSpacing: '.04em', color: 'rgba(255,255,255,0.55)' }}>GitHub ↗</a>
              <a href="https://www.linkedin.com/in/jeevan-baabu-murugan-ba3667426/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, letterSpacing: '.04em', color: 'rgba(255,255,255,0.55)' }}>LinkedIn ↗</a>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, letterSpacing: '.04em', color: 'rgba(255,255,255,0.55)' }}>Résumé ↗</a>
              <a href="mailto:jeevanbaabu03@gmail.com" style={{ fontSize: 13, letterSpacing: '.04em', color: 'rgba(255,255,255,0.55)' }}>Email ↗</a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function NavRow({ num, href, label, onNavigate }: { num: string; href: string; label: string; onNavigate: () => void }) {
  const rowRef = useRef<HTMLAnchorElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const scramble = useScramble()

  return (
    <a
      ref={rowRef}
      href={href}
      onClick={onNavigate}
      onMouseEnter={() => {
        if (rowRef.current) { rowRef.current.style.color = '#fff'; rowRef.current.style.background = 'rgba(255,255,255,0.04)' }
        if (barRef.current) { barRef.current.style.transition = 'width .28s cubic-bezier(.2,.9,.2,1)'; barRef.current.style.width = '100%' }
        if (textRef.current) scramble(textRef.current, label, 420)
      }}
      onMouseLeave={() => {
        if (rowRef.current) { rowRef.current.style.color = 'rgba(255,255,255,0.62)'; rowRef.current.style.background = '' }
        if (barRef.current) { barRef.current.style.transition = 'width .28s cubic-bezier(.2,.9,.2,1)'; barRef.current.style.width = '0%' }
      }}
      style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 16, padding: 16, borderRadius: 14, overflow: 'hidden', color: 'rgba(255,255,255,0.62)' }}
    >
      <span ref={barRef} style={{ position: 'absolute', left: 0, top: 0, height: 1, width: '0%', background: '#fff' }} />
      <span style={{ fontSize: 11, color: '#6f879c', letterSpacing: '.1em', width: 24 }}>{num}</span>
      <span ref={textRef} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 30, lineHeight: 1 }}>{label}</span>
    </a>
  )
}
