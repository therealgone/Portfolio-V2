'use client'
import { useRef } from 'react'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import { useScrambleOnView } from '../hooks/useScrambleOnView'
import { useScrambleOnHover } from '../hooks/useScrambleOnHover'
import { useBarWipe } from '../hooks/useBarWipe'

export default function Academics() {
  const h2Ref = useRef<HTMLHeadingElement>(null)
  const scrambleRef = useRef<HTMLSpanElement>(null)
  const degreeRef = useRef<HTMLDivElement>(null)
  const linkedinRef = useRef<HTMLAnchorElement>(null)

  useRevealOnScroll(h2Ref)
  useScrambleOnView(scrambleRef, 'Electives')
  useRevealOnScroll(degreeRef)

  return (
    <section id="credentials" data-screen-label="Academics" style={{ position: 'relative', zIndex: 5, background: '#000', padding: '140px 24px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 56 }}>
          <span style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', color: '#6f879c' }}>04 / Academics</span>
          <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }} />
        </div>

        <h2 ref={h2Ref} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(38px, 6vw, 84px)', lineHeight: 0.92, letterSpacing: '-0.025em', margin: '0 0 28px', maxWidth: '22ch' }}>
          Degree done. <span ref={scrambleRef}>Electives</span> by choice.
        </h2>

        <div ref={degreeRef} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px 28px', padding: '26px 28px', marginBottom: 72, borderRadius: 20, background: 'rgba(255,255,255,0.035)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12)' }}>
          <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 'clamp(19px, 2vw, 25px)', lineHeight: 1.25, flex: '1 1 340px', minWidth: 0 }}>B.Tech, Computer Science Engineering &mdash; AI &amp; Machine Learning</span>
          <span style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.5)', flex: '1 1 240px' }}>SRM Institute of Science and Technology, Kattankulathur &middot; 2022 &ndash; 2026</span>
          <span style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: '#6f879c', flex: 'none' }}>First Class with Distinction &middot; GPA 8.29 / 10</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 28 }}>
          <span style={{ fontSize: 20, color: '#6f879c' }}>Experience</span>
          <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ fontSize: 11, letterSpacing: '.18em', color: 'rgba(255,255,255,0.3)' }}>01</span>
        </div>
        <ExperienceRow />

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 8 }}>
          <span style={{ fontSize: 20, color: '#6f879c' }}>Special electives</span>
          <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ fontSize: 11, letterSpacing: '.18em', color: 'rgba(255,255,255,0.3)' }}>02</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 76 }}>
          <ElectiveRow
            code="21IPE401"
            title="Capstone Program in Electronic Cooling"
            meta="O Grade · 6 Credits · Nov 2024"
            desc="A specialist elective outside my core AI/ML track — thermal design for electronics, taken because the physics of keeping hardware alive matters to anyone deploying models on real devices."
          />
          <ElectiveRow
            code="21MEO113J"
            title="Electronics Thermal Management"
            meta="A Grade · SRMIST"
            desc="The companion course: heat transfer, cooling strategy and thermal limits in electronic systems."
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 28 }}>
          <span style={{ fontSize: 20, color: '#6f879c' }}>Licenses &amp; certifications</span>
          <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          <a
            ref={linkedinRef}
            href="https://www.linkedin.com/in/jeevan-baabu-murugan-ba3667426/details/certifications/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => { if (linkedinRef.current) { linkedinRef.current.style.color = '#fff'; linkedinRef.current.style.borderColor = '#fff' } }}
            onMouseLeave={() => { if (linkedinRef.current) { linkedinRef.current.style.color = 'rgba(255,255,255,0.5)'; linkedinRef.current.style.borderColor = 'rgba(255,255,255,0.2)' } }}
            style={{ flex: 'none', fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 3, transition: 'color .5s cubic-bezier(.52,.01,0,1), border-color .5s cubic-bezier(.52,.01,0,1)' }}
          >
            Verify on LinkedIn ↗
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          <CertCard issuer="AWS Academy" title="AWS Certified Machine Learning" meta="Artificial Intelligence · Machine Learning" />
          <CertCard issuer="Zscaler" title="Zero Trust Cloud Security" meta="Cloud Computing" />
          <CertCard issuer="Google for Developers" title="India Edu Program" meta="Software Development · Android Development" />
          <CertCard issuer="JPMorgan Chase & Co." title="Software Engineering Job Simulation" meta="Forage · Aug 2023" />
          <CertCard issuer="Oracle" title="Machine Learning on Oracle Cloud" meta="Jan 2025" />
          <CertCard issuer="CITI Program" title="Human Research Curriculum" meta="MIT-affiliated · valid through Feb 2028" />
        </div>
      </div>
    </section>
  )
}

function ExperienceRow() {
  const rowRef = useRef<HTMLAnchorElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const titleRef = useRef<HTMLSpanElement>(null)

  useRevealOnScroll(rowRef)
  useBarWipe(rowRef, barRef)
  useScrambleOnHover(rowRef, titleRef, 'Intern, ADNOC Group')

  return (
    <a
      ref={rowRef}
      href="https://www.linkedin.com/posts/jeevan-baabu-murugan-ba3667426_certificate-ugcPost-7490362479848386561-Es4y/"
      target="_blank"
      rel="noopener noreferrer"
      data-grid3=""
      onMouseEnter={() => { if (rowRef.current) rowRef.current.style.color = '#fff' }}
      onMouseLeave={() => { if (rowRef.current) rowRef.current.style.color = 'rgba(255,255,255,0.62)' }}
      style={{ position: 'relative', overflow: 'hidden', display: 'grid', gridTemplateColumns: 'minmax(140px, 0.5fr) minmax(0, 1.5fr) minmax(0, 1.4fr)', gap: 28, alignItems: 'start', padding: '30px 4px', marginBottom: 76, borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.62)' }}
    >
      <span ref={barRef} style={{ position: 'absolute', left: 0, top: 0, height: 1, width: '0%', background: '#fff', transition: 'width .5s cubic-bezier(.52,.01,0,1)' }} />
      <span style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: '#6f879c', paddingTop: 5 }}>Dec 2025 &mdash; Jan 2026</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span ref={titleRef} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 'clamp(20px, 2.2vw, 27px)', lineHeight: 1.15 }}>Intern, ADNOC Group</span>
        <span style={{ fontSize: 12, letterSpacing: '.06em', color: 'rgba(255,255,255,0.4)' }}>United Arab Emirates &middot; On-site &middot; 2 mos</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ margin: 0, fontWeight: 300, fontSize: 15, lineHeight: 1.5, color: 'rgba(255,255,255,0.5)' }}>
          Two months inside one of the region&apos;s largest energy groups, across refinery operations and network administration &mdash; industrial systems at a scale you can&apos;t simulate.
        </p>
        <span style={{ fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(111,135,156,0.85)' }}>Certificate on LinkedIn ↗</span>
      </div>
    </a>
  )
}

function ElectiveRow({ code, title, meta, desc }: { code: string; title: string; meta: string; desc: string }) {
  const rowRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const titleRef = useRef<HTMLSpanElement>(null)

  useRevealOnScroll(rowRef)
  useBarWipe(rowRef, barRef)
  useScrambleOnHover(rowRef, titleRef, title)

  return (
    <div
      ref={rowRef}
      data-grid3=""
      style={{ position: 'relative', overflow: 'hidden', display: 'grid', gridTemplateColumns: 'minmax(110px, 0.42fr) minmax(0, 1.5fr) minmax(0, 1.5fr)', gap: 28, alignItems: 'start', padding: '30px 4px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
    >
      <span ref={barRef} style={{ position: 'absolute', left: 0, top: 0, height: 1, width: '0%', background: '#fff', transition: 'width .5s cubic-bezier(.52,.01,0,1)' }} />
      <span style={{ fontSize: 11, letterSpacing: '.16em', color: '#6f879c', paddingTop: 5 }}>{code}</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span ref={titleRef} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 'clamp(20px, 2.2vw, 27px)', lineHeight: 1.15 }}>{title}</span>
        <span style={{ fontSize: 12, letterSpacing: '.06em', color: 'rgba(255,255,255,0.4)' }}>{meta}</span>
      </div>
      <p style={{ margin: 0, fontWeight: 300, fontSize: 15, lineHeight: 1.5, color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
    </div>
  )
}

function CertCard({ issuer, title, meta }: { issuer: string; title: string; meta: string }) {
  const rowRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const titleRef = useRef<HTMLSpanElement>(null)

  useRevealOnScroll(rowRef)
  useBarWipe(rowRef, barRef)
  useScrambleOnHover(rowRef, titleRef, title)

  return (
    <div
      ref={rowRef}
      style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 10, borderRadius: 20, padding: '26px 24px', background: 'rgba(255,255,255,0.035)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12)' }}
    >
      <span ref={barRef} style={{ position: 'absolute', left: 0, top: 0, height: 1, width: '0%', background: '#fff', transition: 'width .5s cubic-bezier(.52,.01,0,1)' }} />
      <span style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: '#6f879c' }}>{issuer}</span>
      <span ref={titleRef} style={{ fontSize: 17, lineHeight: 1.3, color: 'rgba(255,255,255,0.9)' }}>{title}</span>
      <span style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{meta}</span>
    </div>
  )
}
