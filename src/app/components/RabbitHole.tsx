'use client'
import { useEffect, useRef, useState } from 'react'
import { useScramble } from '../hooks/useScramble'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import { useScrambleOnView } from '../hooks/useScrambleOnView'

type BranchId = 'b1' | 'b2' | 'b3' | 'b4'

const BRANCHES: { id: BranchId; q: string; kids: string[] }[] = [
  { id: 'b1', q: 'make it faster?', kids: ['squeeze more FPS out of a game', 'optimize the whole system', 'troubleshoot a stubborn Windows install'] },
  { id: 'b2', q: "what's actually inside?", kids: ['open up the hardware', 'replace the thermal paste', 'find what is really going wrong'] },
  { id: 'b3', q: 'can i get around it?', kids: ['work around software limitations', 'modify games', 'touch things I was not supposed to touch'] },
]
const B4 = { id: 'b4' as const, q: 'find out properly', kids: ["Windows, Linux and macOS — all three, on purpose", 'break it, research it, fix it, repeat', "then stop patching other people's software and write my own"] }

export default function RabbitHole() {
  const [opened, setOpened] = useState<Set<BranchId>>(new Set())
  const [unlocked, setUnlocked] = useState(false)
  const scramble = useScramble()

  const kidsRefs = useRef<Partial<Record<BranchId, HTMLDivElement | null>>>({})
  const signRefs = useRef<Partial<Record<BranchId, HTMLSpanElement | null>>>({})
  const convergeRef = useRef<HTMLDivElement>(null)
  const finalRef = useRef<HTMLDivElement>(null)
  const finalLineRef = useRef<HTMLSpanElement>(null)
  const caretRef = useRef<HTMLSpanElement>(null)

  const h3Ref = useRef<HTMLHeadingElement>(null)
  const h3SpanRef = useRef<HTMLSpanElement>(null)
  const p1Ref = useRef<HTMLParagraphElement>(null)
  const p2Ref = useRef<HTMLParagraphElement>(null)
  useRevealOnScroll(h3Ref)
  useScrambleOnView(h3SpanRef, 'how things work')
  useRevealOnScroll(p1Ref)
  useRevealOnScroll(p2Ref)

  useEffect(() => {
    const caret = caretRef.current
    if (!caret) return
    const id = setInterval(() => {
      caret.style.opacity = caret.style.opacity === '0' ? '1' : '0'
    }, 560)
    return () => clearInterval(id)
  }, [])

  const setOpen = (id: BranchId, on: boolean) => {
    const kids = kidsRefs.current[id]
    const sign = signRefs.current[id]
    if (kids) {
      kids.style.maxHeight = on ? kids.scrollHeight + 'px' : '0px'
      kids.style.opacity = on ? '1' : '0'
    }
    if (sign) {
      sign.textContent = on ? '−' : '+'
      sign.style.background = on ? '#fff' : 'rgba(255,255,255,0.06)'
      sign.style.color = on ? '#000' : 'rgba(255,255,255,0.7)'
    }

    setOpened((prev) => {
      const next = new Set(prev)
      if (on) next.add(id); else next.delete(id)

      if (['b1', 'b2', 'b3'].every((k) => next.has(k as BranchId))) {
        unlock()
      }
      // Re-measure the converge block if it's already expanded but not yet
      // set to 'none' — otherwise opening b4 after unlock re-clamps it to a
      // stale pixel height and hides the payoff (source lines 886-890).
      const converge = convergeRef.current
      if (converge && !unlockedRef.current && converge.style.maxHeight && converge.style.maxHeight !== '0px' && converge.style.maxHeight !== 'none') {
        converge.style.maxHeight = converge.scrollHeight + 'px'
      }
      return next
    })
  }

  const unlockedRef = useRef(false)
  const unlock = () => {
    if (unlockedRef.current) return
    unlockedRef.current = true
    setUnlocked(true)
    const converge = convergeRef.current
    if (!converge) return
    converge.style.maxHeight = converge.scrollHeight + 'px'
    converge.style.opacity = '1'
    setTimeout(() => {
      if (finalRef.current) {
        finalRef.current.style.opacity = '1'
        finalRef.current.style.transform = 'none'
      }
      if (finalLineRef.current) scramble(finalLineRef.current, "I just know I'll figure it out.", 700)
      if (convergeRef.current) convergeRef.current.style.maxHeight = 'none'
    }, 700)
  }

  const allOpen = ['b1', 'b2', 'b3', 'b4'].every((id) => opened.has(id as BranchId))
  const toggleAll = () => {
    const every: BranchId[] = ['b1', 'b2', 'b3', 'b4']
    const shut = every.some((id) => !opened.has(id))
    every.forEach((id, i) => setTimeout(() => setOpen(id, shut), i * 110))
  }

  return (
    <div id="rabbit-hole" style={{ maxWidth: 1200, margin: '0 auto', padding: '130px 0 40px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 40 }}>
        <span style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', color: '#6f879c' }}>01.5 / The rabbit hole</span>
        <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 56, alignItems: 'start' }}>
        <div>
          <h3 ref={h3Ref} style={{ margin: '0 0 20px', fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(30px, 3.6vw, 52px)', lineHeight: 1.05, letterSpacing: '-0.02em', maxWidth: '18ch' }}>
            I&apos;ve always been curious about <span ref={h3SpanRef}>how things work</span>.
          </h3>
          <p ref={p1Ref} style={{ margin: '0 0 16px', fontWeight: 300, fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,0.5)', maxWidth: '46ch' }}>
            Long before I studied Computer Science I was experimenting with technology on my own — Windows, Linux and macOS, software and hardware alike, learning most of it by trying, breaking, researching and fixing.
          </p>
          <p ref={p2Ref} style={{ margin: 0, fontWeight: 300, fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,0.5)', maxWidth: '46ch' }}>
            That curiosity is what made me. It always started the same way &mdash; <span style={{ color: 'rgba(255,255,255,0.85)' }}>open it up.</span>
          </p>
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, paddingBottom: 14, marginBottom: 4, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
            <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, 'Cascadia Mono', monospace", fontSize: 'clamp(13px, 1.4vw, 17px)', color: '#fff' }}>
              &gt; i wonder if i can
              <span ref={caretRef} style={{ display: 'inline-block', width: 8, height: 15, marginLeft: 4, background: '#fff', verticalAlign: -2 }} />
            </span>
            <button type="button" onClick={toggleAll} style={{ flex: 'none', border: 'none', background: 'transparent', fontFamily: "ui-monospace, SFMono-Regular, Menlo, 'Cascadia Mono', monospace", fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}>
              {allOpen ? 'close all' : 'open all'}
            </button>
          </div>

          {BRANCHES.map((b) => (
            <Branch key={b.id} id={b.id} q={b.q} kids={b.kids} open={opened.has(b.id)} onToggle={() => setOpen(b.id, !opened.has(b.id))} kidsRef={(el) => { kidsRefs.current[b.id] = el }} signRef={(el) => { signRefs.current[b.id] = el }} />
          ))}

          <div ref={convergeRef} style={{ overflow: 'hidden', maxHeight: 0, opacity: 0, transition: 'max-height .7s cubic-bezier(.52,.01,0,1), opacity .6s cubic-bezier(.52,.01,0,1)' }}>
            <div style={{ paddingTop: 26 }}>
              <span style={{ display: 'block', fontFamily: "ui-monospace, SFMono-Regular, Menlo, 'Cascadia Mono', monospace", fontSize: 'clamp(13px, 1.4vw, 17px)', color: '#fff', marginBottom: 4 }}>
                &gt; so how does this actually work?
              </span>
              <Branch id={B4.id} q={B4.q} kids={B4.kids} open={opened.has('b4')} onToggle={() => setOpen('b4', !opened.has('b4'))} kidsRef={(el) => { kidsRefs.current.b4 = el }} signRef={(el) => { signRefs.current.b4 = el }} />
              <div ref={finalRef} style={{ marginTop: 26, padding: '22px 24px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12)', opacity: 0, transform: 'translateY(14px)', transition: 'opacity .7s cubic-bezier(.52,.01,0,1), transform .7s cubic-bezier(.52,.01,0,1)' }}>
                <span style={{ display: 'block', fontFamily: "ui-monospace, SFMono-Regular, Menlo, 'Cascadia Mono', monospace", fontSize: 12, color: 'rgba(111,135,156,0.85)', marginBottom: 10 }}>
                  // i don&apos;t always know the answer when i start
                </span>
                <span ref={finalLineRef} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 'clamp(24px, 3vw, 38px)', lineHeight: 1.1, color: '#fff' }}>
                  {unlocked ? "I just know I'll figure it out." : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Branch({ id, q, kids, open, onToggle, kidsRef, signRef }: {
  id: BranchId; q: string; kids: string[]; open: boolean; onToggle: () => void
  kidsRef: (el: HTMLDivElement | null) => void; signRef: (el: HTMLSpanElement | null) => void
}) {
  const textRef = useRef<HTMLSpanElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const scramble = useScramble()

  return (
    <div data-branch={id} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <button
        ref={btnRef}
        type="button"
        onClick={onToggle}
        onMouseEnter={() => { if (btnRef.current) btnRef.current.style.color = '#fff'; if (textRef.current) scramble(textRef.current, q) }}
        onMouseLeave={() => { if (btnRef.current) btnRef.current.style.color = 'rgba(255,255,255,0.85)' }}
        style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, padding: '20px 2px', color: 'rgba(255,255,255,0.85)', transition: 'color .5s cubic-bezier(.52,.01,0,1)', cursor: 'pointer' }}
      >
        <span ref={signRef} style={{ flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 6, background: open ? '#fff' : 'rgba(255,255,255,0.06)', fontFamily: "ui-monospace, SFMono-Regular, Menlo, 'Cascadia Mono', monospace", fontSize: 13, lineHeight: 1, color: open ? '#000' : 'rgba(255,255,255,0.7)', transition: 'background .5s cubic-bezier(.52,.01,0,1), color .5s cubic-bezier(.52,.01,0,1)' }}>
          {open ? '−' : '+'}
        </span>
        <span ref={textRef} style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, 'Cascadia Mono', monospace", fontSize: 'clamp(13px, 1.3vw, 16px)', letterSpacing: '.02em' }}>{q}</span>
      </button>
      <div ref={kidsRef} style={{ overflow: 'hidden', maxHeight: 0, opacity: 0, transition: 'max-height .6s cubic-bezier(.52,.01,0,1), opacity .5s cubic-bezier(.52,.01,0,1)' }}>
        <div style={{ padding: '2px 0 20px 36px', borderLeft: '1px solid rgba(255,255,255,0.09)', marginLeft: 10 }}>
          {kids.map((k) => (
            <div key={k} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '9px 0' }}>
              <span style={{ flex: 'none', fontFamily: "ui-monospace, SFMono-Regular, Menlo, 'Cascadia Mono', monospace", fontSize: 12, color: 'rgba(111,135,156,0.7)', paddingTop: 2 }}>└─</span>
              <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, 'Cascadia Mono', monospace", fontSize: 'clamp(12px, 1.15vw, 14px)', lineHeight: 1.55, color: 'rgba(255,255,255,0.62)' }}>{k}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
