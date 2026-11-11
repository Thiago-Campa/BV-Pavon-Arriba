import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { institution, carouselImages } from '../data.js'
import './Splash.css'

const MIN_MS = 2200 // tiempo mínimo que se ve la animación
const MAX_MS = 7000 // si algo tarda demasiado, la página se abre igual

const FILL_TOP = 62 // altura (en el dibujo) donde termina la carga: arriba del cuello
const FILL_BOTTOM = 220

// Silueta del matafuegos: cuello + cuerpo redondeado.
const BODY = 'M55 62 L55 80 A20 20 0 0 0 35 100 L35 200 A20 20 0 0 0 55 220 L85 220 A20 20 0 0 0 105 200 L105 100 A20 20 0 0 0 85 80 L85 62 Z'

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = resolve
    img.onerror = resolve // si falla, no frena la carga
    img.src = src
  })
}

function Extinguisher({ progress }) {
  const fillH = ((FILL_BOTTOM - FILL_TOP) * progress) / 100
  const fillY = FILL_BOTTOM - fillH

  return (
    <svg className="splash-ext" viewBox="0 0 140 240" aria-hidden="true">
      <defs>
        <clipPath id="ext-clip">
          <path d={BODY} />
        </clipPath>
      </defs>

      {/* manguera y boquilla */}
      <path d="M92 56 C 126 56, 130 104, 114 134" className="ext-hose" />
      <rect x="107" y="130" width="13" height="17" rx="3" transform="rotate(-20 114 138)" className="ext-dark" />

      {/* cuerpo vacío */}
      <path d={BODY} className="ext-empty" />

      {/* carga que sube */}
      <g clipPath="url(#ext-clip)">
        <rect x="0" y={fillY} width="140" height={fillH + 1} className="ext-fill" />
        <rect x="0" y={fillY} width="140" height="3" className="ext-shine" />
      </g>

      {/* etiqueta con llama */}
      <rect x="35" y="140" width="70" height="46" className="ext-label" />
      <path d="M70 147 C 60 159, 58 170, 70 179 C 82 170, 80 159, 70 147 Z" className="ext-flame" />
      <path d="M70 160 C 65 167, 65 172, 70 176 C 75 172, 75 167, 70 160 Z" className="ext-flame-core" />

      <path d={BODY} className="ext-outline" />

      {/* cabezal, manija, manómetro y base */}
      <rect x="47" y="44" width="46" height="20" rx="5" className="ext-dark" />
      <rect x="42" y="35" width="56" height="7" rx="3.5" transform="rotate(-8 70 38)" className="ext-dark" />
      <circle cx="98" cy="50" r="5" className="ext-ring" />
      <circle cx="70" cy="54" r="6" className="ext-gauge" />
      <path d="M70 54 L73.5 50" className="ext-needle" />
      <rect x="40" y="218" width="60" height="7" rx="3.5" className="ext-dark" />
    </svg>
  )
}

export default function Splash() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)
  const [reduceMotion] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)
  // Se pone en true cuando la página terminó de cargar de verdad.
  const [loaded, setLoaded] = useState(false)

  // 1) Esperar a que cargue lo importante: página, tipografías y la primera imagen del carrusel.
  useEffect(() => {
    let cancelled = false
    const pageLoaded = new Promise((resolve) => {
      if (document.readyState === 'complete') resolve()
      else window.addEventListener('load', resolve, { once: true })
    })
    const fonts = document.fonts?.ready ?? Promise.resolve()
    const hero = carouselImages[0] ? preloadImage(carouselImages[0].src) : Promise.resolve()
    const minTime = new Promise((resolve) => setTimeout(resolve, reduceMotion ? 300 : MIN_MS))
    const maxTime = new Promise((resolve) => setTimeout(resolve, MAX_MS))

    Promise.race([Promise.all([pageLoaded, fonts, hero, minTime]), maxTime]).then(() => {
      if (!cancelled) setLoaded(true)
    })
    return () => {
      cancelled = true
    }
  }, [reduceMotion])

  // 2) Animar la carga: sube despacio hasta ~90% y, cuando todo está listo, completa el 100%.
  useEffect(() => {
    let raf
    let doneTimer
    let p = 0
    let last = performance.now()

    const tick = (now) => {
      const dt = now - last
      last = now
      const target = loaded ? 100 : 90
      p += (target - p) * (1 - Math.exp(-dt / (loaded ? 180 : 700)))
      if (loaded && p > 99.6) p = 100
      setProgress(p)
      if (p >= 100) {
        doneTimer = setTimeout(() => setVisible(false), reduceMotion ? 0 : 500)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(doneTimer)
    }
  }, [loaded, reduceMotion])

  // Mientras se ve la pantalla de carga, no se puede hacer scroll.
  useEffect(() => {
    if (!visible) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="splash"
          role="status"
          aria-live="polite"
          aria-label="Cargando la página"
          exit={reduceMotion ? { opacity: 0 } : { y: '-100%' }}
          transition={{ duration: reduceMotion ? 0.2 : 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="splash-inner">
            <Extinguisher progress={progress} />
            <p className="splash-name">{institution.name}</p>
            <div className="splash-bar">
              <span style={{ width: `${progress}%` }} />
            </div>
            <p className="splash-percent">Cargando… {Math.round(progress)}%</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
