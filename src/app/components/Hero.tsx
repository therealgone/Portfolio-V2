'use client'
import { useEffect, useRef } from 'react'
import { useScrollEngine } from '../hooks/useScrollEngine'

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

export default function Hero() {
  const { subscribe } = useScrollEngine()
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const cueRef = useRef<HTMLDivElement>(null)
  const seetheworkRef = useRef<HTMLAnchorElement>(null)
  const getintouchRef = useRef<HTMLAnchorElement>(null)
  const resumeRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    video.playsInline = true
    video.loop = true
    const src = 'https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8'
    let hls: import('hls.js').default | undefined

    const start = async () => {
      const HlsMod = (await import('hls.js')).default
      if (HlsMod.isSupported()) {
        hls = new HlsMod({ enableWorker: true })
        hls.loadSource(src)
        hls.attachMedia(video)
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src
      }
      video.play().catch(() => {})
    }
    start()

    return () => { hls?.destroy() }
  }, [])

  useEffect(() => {
    return subscribe(() => {
      const wrap = wrapRef.current
      const content = contentRef.current
      if (!wrap || !content) return
      const vh = window.innerHeight
      const total = wrap.offsetHeight - vh
      const p = clamp(-wrap.getBoundingClientRect().top / total, 0, 1)
      content.style.transform = `translateY(${-p * 90}px) scale(${1 - p * 0.08})`
      content.style.opacity = String(clamp(1 - p * 1.5, 0, 1))
      content.style.filter = `blur(${p * 5}px)`
      if (videoRef.current) videoRef.current.style.transform = `scale(${1.04 + p * 0.14})`
      if (cueRef.current) cueRef.current.style.opacity = String(clamp(1 - p * 4, 0, 1))
    })
  }, [subscribe])

  return (
    <section id="home" style={{ position: 'relative', height: '240vh' }}>
      <div ref={wrapRef} style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, opacity: 0.85, transform: 'scale(1.04)' }}
        />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'radial-gradient(120% 80% at 50% 45%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 70%, #000 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 220, zIndex: 2, background: 'linear-gradient(to bottom, #000, transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 260, zIndex: 2, background: 'linear-gradient(to top, #000, transparent)', pointerEvents: 'none' }} />

        <div ref={contentRef} style={{ position: 'relative', zIndex: 3, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '72px 24px 78px' }}>
          <div style={{ fontSize: 11, letterSpacing: '.3em', textTransform: 'uppercase', color: '#6f879c', marginBottom: 'min(26px, 2.4vh)' }}>Portfolio — V3</div>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(34px, min(9.5vw, 10.5vh), 132px)', lineHeight: 1.32, letterSpacing: '-0.03em', margin: 0, maxWidth: '15ch', textWrap: 'balance' }}>
            <span style={{ display: 'block' }}>Jeevan Baabu</span>
            <span style={{ display: 'block', color: 'rgba(255,255,255,0.55)' }}>Murugan</span>
          </h1>
          <p style={{ margin: 'min(28px, 2.6vh) 0 0', fontWeight: 300, fontSize: 'clamp(13px, 1.4vw, 18px)', color: 'rgba(255,255,255,0.6)', maxWidth: '46ch', lineHeight: 1.5 }}>
            Computer Science Engineering — AI &amp; Machine Learning. I build full-stack products, AI tooling and edge–cloud systems, end to end.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 'min(36px, 3.4vh)', flexWrap: 'wrap' }}>
            <a
              ref={seetheworkRef}
              href="#project"
              className="glass"
              onMouseEnter={() => { if (seetheworkRef.current) seetheworkRef.current.style.background = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={() => { if (seetheworkRef.current) seetheworkRef.current.style.background = '' }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 999, padding: '13px 22px', fontSize: 14, fontWeight: 500, color: '#fff' }}
            >
              See the work <span style={{ fontSize: 15 }}>↗</span>
            </a>
            <a
              ref={getintouchRef}
              href="#contact"
              onMouseEnter={() => { if (getintouchRef.current) getintouchRef.current.style.background = 'rgba(255,255,255,0.88)' }}
              onMouseLeave={() => { if (getintouchRef.current) getintouchRef.current.style.background = '#fff' }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 999, padding: '13px 22px', fontSize: 14, fontWeight: 500, background: '#fff', color: '#000' }}
            >
              Get in touch <span style={{ fontSize: 13 }}>↗</span>
            </a>
            <a
              ref={resumeRef}
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => { if (resumeRef.current) { resumeRef.current.style.color = '#fff'; resumeRef.current.style.borderColor = '#fff' } }}
              onMouseLeave={() => { if (resumeRef.current) { resumeRef.current.style.color = 'rgba(255,255,255,0.55)'; resumeRef.current.style.borderColor = 'rgba(255,255,255,0.2)' } }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 4px', fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.55)', borderBottom: '1px solid rgba(255,255,255,0.2)', transition: 'color .5s cubic-bezier(.52,.01,0,1), border-color .5s cubic-bezier(.52,.01,0,1)' }}
            >
              Résumé (PDF)
            </a>
          </div>
        </div>

        <div ref={cueRef} style={{ position: 'absolute', bottom: 34, left: 0, right: 0, zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.45)', fontSize: 10, letterSpacing: '.24em', textTransform: 'uppercase' }}>
          <span>Scroll</span>
          <span style={{ animation: 'om-cue 2s ease-in-out infinite', fontSize: 13 }}>↓</span>
        </div>
      </div>
    </section>
  )
}
