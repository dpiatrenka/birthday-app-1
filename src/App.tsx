import { useEffect, useRef, useState } from 'react'
import './App.css'

const PREVIEW_URL = '/dasha-card.jpg'
const DOWNLOAD_URL = '/sertifikat-marsel.jpg'
const DOWNLOAD_NAME = 'podarochnyi-sertifikat-Marsel.jpg'

const BALLOON_COLORS = [
  '#ff2d6f',
  '#ff7a18',
  '#ffe14a',
  '#7dff6b',
  '#3ecbff',
  '#a855ff',
  '#ff5cac',
]

function downloadImage() {
  const a = document.createElement('a')
  a.href = DOWNLOAD_URL
  a.download = DOWNLOAD_NAME
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

function Balloons({ burst }: { burst: boolean }) {
  const balloons = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${6 + ((i * 11.5) % 82)}%`,
    delay: `${(i % 5) * 0.55}s`,
    duration: `${8 + (i % 4) * 1.2}s`,
    color: BALLOON_COLORS[i % BALLOON_COLORS.length],
    size: `${78 + (i % 3) * 18}px`,
    sway: `${(i % 2 === 0 ? 1 : -1) * (14 + (i % 3) * 6)}px`,
    rotate: `${(i % 2 === 0 ? -1 : 1) * (3 + (i % 3) * 2)}deg`,
  }))

  return (
    <div className={`balloons${burst ? ' balloons--burst' : ''}`} aria-hidden="true">
      {balloons.map((b) => (
        <span
          key={b.id}
          className="balloon"
          style={{
            left: b.left,
            width: b.size,
            animationDelay: b.delay,
            animationDuration: b.duration,
            ['--balloon' as string]: b.color,
            ['--sway' as string]: b.sway,
            ['--tilt' as string]: b.rotate,
          }}
        >
          <span className="balloon__body" />
          <span className="balloon__tail" />
          <span className="balloon__string" />
        </span>
      ))}
    </div>
  )
}

function Sparkles({ active }: { active: boolean }) {
  if (!active) return null

  const sparks = Array.from({ length: 48 }, (_, i) => ({
    id: i,
    left: `${8 + ((i * 9) % 84)}%`,
    top: `${10 + ((i * 13) % 70)}%`,
    delay: `${(i % 12) * 0.04}s`,
    color: BALLOON_COLORS[i % BALLOON_COLORS.length],
    size: `${5 + (i % 4) * 3}px`,
  }))

  return (
    <div className="sparkles" aria-hidden="true">
      {sparks.map((s) => (
        <span
          key={s.id}
          className="sparkle"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            background: s.color,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  )
}

function ConfettiBurst({ active }: { active: boolean }) {
  if (!active) return null

  const pieces = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    left: `${(i * 8.3 + 3) % 100}%`,
    delay: `${(i % 20) * 0.035}s`,
    duration: `${2.2 + (i % 8) * 0.28}s`,
    color: BALLOON_COLORS[i % BALLOON_COLORS.length],
    rotate: `${(i * 47) % 360}deg`,
    size: `${6 + (i % 6) * 3}px`,
    shape: i % 5,
    drift: `${(i % 2 === 0 ? 1 : -1) * (20 + (i % 7) * 8)}px`,
  }))

  const ribbons = Array.from({ length: 18 }, (_, i) => ({
    id: `r${i}`,
    left: `${6 + ((i * 5.3) % 88)}%`,
    delay: `${(i % 9) * 0.08}s`,
    duration: `${2.8 + (i % 4) * 0.35}s`,
    color: BALLOON_COLORS[i % BALLOON_COLORS.length],
    height: `${28 + (i % 5) * 8}px`,
  }))

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className={`confetti__piece confetti__piece--${p.shape}`}
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            background: p.color,
            width: p.size,
            height: p.size,
            ['--rot' as string]: p.rotate,
            ['--drift' as string]: p.drift,
          }}
        />
      ))}
      {ribbons.map((r) => (
        <span
          key={r.id}
          className="confetti__ribbon"
          style={{
            left: r.left,
            animationDelay: r.delay,
            animationDuration: r.duration,
            background: r.color,
            height: r.height,
          }}
        />
      ))}
    </div>
  )
}

function Flash({ active }: { active: boolean }) {
  if (!active) return null
  return <div className="flash" aria-hidden="true" />
}

function App() {
  const [opened, setOpened] = useState(false)
  const [celebrating, setCelebrating] = useState(false)
  const [photoOk, setPhotoOk] = useState(true)
  const stageRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = stageRef.current
    if (!el) return

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      el.style.setProperty('--mx', `${x * 8}px`)
      el.style.setProperty('--my', `${y * 5}px`)
    }

    el.addEventListener('pointermove', onMove)
    return () => el.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    if (!celebrating) return
    const t = window.setTimeout(() => setCelebrating(false), 4800)
    return () => window.clearTimeout(t)
  }, [celebrating])

  const openEnvelope = () => {
    if (opened) {
      downloadImage()
      setCelebrating(true)
      return
    }

    setOpened(true)
    setCelebrating(true)
    window.setTimeout(downloadImage, 900)
  }

  return (
    <main
      className={`stage${opened ? ' stage--opened' : ''}${celebrating ? ' stage--party' : ''}`}
      ref={stageRef}
      aria-label="С днём рождения, Дашенька"
    >
      <Flash active={celebrating} />
      <ConfettiBurst active={celebrating} />
      <Sparkles active={celebrating} />
      <Balloons burst={opened} />

      <div className="stage__atmosphere" aria-hidden="true">
        <span className="stage__wash" />
        <span className="stage__dots" />
        <span className="stage__shine" />
      </div>

      <div className="stage__photo-plane">
        {photoOk ? (
          <img
            className="stage__photo"
            src="/dasha.jpg"
            alt=""
            onError={() => setPhotoOk(false)}
          />
        ) : (
          <div className="stage__photo-placeholder" aria-hidden="true" />
        )}
        <div className="stage__veil" />
      </div>

      <div className="stage__content">
        <p className="stage__brand">Дашенька</p>
        <h1 className="stage__title">С днём рождения 🥳</h1>

        <button
          type="button"
          className={`envelope${opened ? ' envelope--open' : ''}`}
          onClick={openEnvelope}
          aria-expanded={opened}
          aria-label={opened ? 'Скачать картинку снова' : 'Открыть конверт'}
        >
          <span className="envelope__ring" aria-hidden="true" />
          <span className="envelope__glow" aria-hidden="true" />
          <span className="envelope__shadow" aria-hidden="true" />
          <span className="envelope__body" aria-hidden="true">
            <span className="envelope__back" />
            <span className="envelope__letter">
              <img src={PREVIEW_URL} alt="" />
            </span>
            <span className="envelope__fold envelope__fold--left" />
            <span className="envelope__fold envelope__fold--right" />
            <span className="envelope__fold envelope__fold--bottom" />
            <span className="envelope__flap" />
            <span className="envelope__seal">Д</span>
          </span>
        </button>
      </div>
    </main>
  )
}

export default App
