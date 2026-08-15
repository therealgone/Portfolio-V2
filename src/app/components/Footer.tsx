'use client'
import { useRef } from 'react'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import { useScrambleOnView } from '../hooks/useScrambleOnView'

const FOOTER_LINKS = [
  { href: '#home', label: 'Top', external: false },
  { href: 'https://github.com/therealgone', label: 'GitHub', external: true },
  { href: 'https://www.linkedin.com/in/jeevan-baabu-murugan-ba3667426/', label: 'LinkedIn', external: true },
  { href: '/resume.pdf', label: 'Résumé', external: true },
]

export default function Footer() {
  const h2Ref = useRef<HTMLHeadingElement>(null)
  const scrambleRef = useRef<HTMLSpanElement>(null)
  useRevealOnScroll(h2Ref)
  useScrambleOnView(scrambleRef, 'next one')

  return (
    <footer style={{ position: 'relative', zIndex: 5, background: '#000', padding: '140px 24px 40px', textAlign: 'center' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h2 ref={h2Ref} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(42px, 7vw, 96px)', lineHeight: 0.86, letterSpacing: '-0.03em', margin: '0 auto 18px', maxWidth: '22ch' }}>
          Let&apos;s build the <span ref={scrambleRef}>next one</span> together.
        </h2>
        <p style={{ margin: '0 auto 34px', fontWeight: 300, fontSize: 15, color: 'rgba(255,255,255,0.5)', maxWidth: '42ch', lineHeight: 1.55 }}>
          No commitment, no pressure. Just possibilities — and probably too many browser tabs.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <a
            href="#contact"
            className="glass"
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.01)' }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 999, padding: '13px 22px', fontSize: 14, fontWeight: 500, color: '#fff' }}
          >
            Start a conversation <span style={{ fontSize: 15 }}>↗</span>
          </a>
          <a
            href="https://github.com/therealgone"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.88)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff' }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 999, padding: '13px 22px', fontSize: 14, fontWeight: 500, background: '#fff', color: '#000' }}
          >
            View GitHub <span style={{ fontSize: 13 }}>↗</span>
          </a>
        </div>
        <div style={{ marginTop: 120, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
          <p style={{ margin: 0, fontWeight: 300, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>© 2026 Jeevan Baabu Murugan. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {FOOTER_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.external ? '_blank' : undefined}
                rel={l.external ? 'noopener noreferrer' : undefined}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
                style={{ fontWeight: 300, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
