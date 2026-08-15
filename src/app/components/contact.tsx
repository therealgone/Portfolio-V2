'use client'
import { useRef, useState } from 'react'
import { useScrambleOnView } from '../hooks/useScrambleOnView'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import { useScrambleOnHover } from '../hooks/useScrambleOnHover'
import { useBarWipe } from '../hooks/useBarWipe'

const LINKS = [
  { href: 'https://github.com/therealgone', label: 'GitHub', meta: 'therealgone ↗', external: true },
  { href: 'https://www.linkedin.com/in/jeevan-baabu-murugan-ba3667426/', label: 'LinkedIn', meta: 'jeevan-baabu ↗', external: true },
  { href: 'mailto:jeevanbaabu03@gmail.com', label: 'Email', meta: 'jeevanbaabu03@gmail.com ↗', external: false },
  { href: '/resume.pdf', label: 'Résumé', meta: 'PDF ↓', external: true },
]

export default function Contact() {
  const h2Ref = useRef<HTMLHeadingElement>(null)
  const scrambleTargetRef = useRef<HTMLSpanElement>(null)
  useRevealOnScroll(h2Ref)
  useScrambleOnView(scrambleTargetRef, 'Say hello')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('https://formspree.io/f/xeokobav', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (res.ok) {
        setSent(true)
        setName(''); setEmail(''); setMessage('')
        setTimeout(() => setSent(false), 5000)
      }
    } catch {
      // offline preview — swallow, matches source's empty catch
    }
  }

  return (
    <section id="contact" style={{ position: 'relative', zIndex: 5, background: '#000', padding: '20px 24px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 56 }}>
          <span style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', color: '#6f879c' }}>05 / Contact</span>
          <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'start' }}>
          <div>
            <h2 ref={h2Ref} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(38px, 6vw, 84px)', lineHeight: 0.9, letterSpacing: '-0.025em', margin: '0 0 20px', maxWidth: '16ch' }}>
              <span ref={scrambleTargetRef}>Say hello</span>, or send me something hard.
            </h2>
            <p style={{ margin: '0 0 28px', fontWeight: 300, fontSize: 17, lineHeight: 1.55, color: 'rgba(255,255,255,0.55)', maxWidth: '40ch' }}>
              B.Tech complete — open to full-stack, AI/ML and cloud engineering roles. Reachable in Chennai and Abu Dhabi — I read everything that lands here.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 420 }}>
              {LINKS.map((l) => <ContactLink key={l.label} {...l} />)}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '18px 4px', fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                <span>Chennai, India</span><span>Abu Dhabi, UAE</span>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="glass" style={{ borderRadius: 24, padding: 28, background: 'rgba(255,255,255,0.02)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12)', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <span style={{ fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: '#6f879c' }}>Send a message</span>
            <input
              type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              style={{ width: '100%', boxSizing: 'border-box', padding: '15px 16px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 15, outline: 'none' }}
            />
            <input
              type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" required
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              style={{ width: '100%', boxSizing: 'border-box', padding: '15px 16px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 15, outline: 'none' }}
            />
            <textarea
              name="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your message" required
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              style={{ width: '100%', boxSizing: 'border-box', height: 150, resize: 'none', padding: '15px 16px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 15, lineHeight: 1.5, outline: 'none' }}
            />
            <button
              type="submit"
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.88)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#fff' }}
              style={{ marginTop: 4, width: '100%', border: 'none', borderRadius: 999, padding: '15px 20px', background: '#fff', color: '#000', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}
            >
              {sent ? 'Message sent — thank you' : 'Send message'} <span style={{ fontSize: 13 }}>↗</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

function ContactLink({ href, label, meta, external }: { href: string; label: string; meta: string; external: boolean }) {
  const rowRef = useRef<HTMLAnchorElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  useBarWipe(rowRef, barRef)
  useScrambleOnHover(rowRef, textRef, label)

  return (
    <a
      ref={rowRef}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onMouseEnter={(e) => { e.currentTarget.style.color = '#fff' }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.62)' }}
      style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 4px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.62)' }}
    >
      <span ref={barRef} style={{ position: 'absolute', left: 0, top: 0, height: 1, width: '0%', background: '#fff' }} />
      <span ref={textRef} style={{ fontSize: 20 }}>{label}</span>
      <span style={{ fontSize: 13, color: '#6f879c' }}>{meta}</span>
    </a>
  )
}
