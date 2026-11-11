import { useEffect, useRef } from 'react'
import './FireCursor.css'

const CLICKABLE = 'a, button, [role="button"], summary, label'
const NATIVE = 'input, textarea, select'

// Cursor de llama. Sobre botones y links se convierte en un matafuegos que tira espuma.
export default function FireCursor() {
  const canvasRef = useRef(null)
  const extRef = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return undefined

    const canvas = canvasRef.current
    const ext = extRef.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const mouse = { x: -200, y: -200, ext: false, native: false, on: false }
    const parts = []
    let raf

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const burst = (n) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2
        const s = 1 + Math.random() * 3
        parts.push(
          mouse.ext
            ? { foam: true, x: mouse.x, y: mouse.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 34, max: 34, size: 5 }
            : { x: mouse.x, y: mouse.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1.5, life: 40, max: 40, size: 3 },
        )
      }
    }

    const onMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      const t = e.target
      mouse.native = !!t.closest?.(NATIVE)
      mouse.ext = !mouse.native && !!t.closest?.(CLICKABLE)
      if (!mouse.on) {
        mouse.on = true
        document.documentElement.classList.add('fire-cursor-on')
      }
      ext.style.transform = `translate(${mouse.x - 4}px, ${mouse.y - 38}px)`
      ext.style.opacity = mouse.ext ? 1 : 0
    }
    const onDown = () => !mouse.native && burst(mouse.ext ? 16 : 14)
    const onLeave = () => {
      mouse.on = false
      mouse.x = mouse.y = -200
      ext.style.opacity = 0
      document.documentElement.classList.remove('fire-cursor-on')
    }

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      if (mouse.on && !mouse.native) {
        if (mouse.ext) {
          if (parts.length < 260)
            parts.push({ foam: true, x: mouse.x, y: mouse.y, vx: -0.9 - Math.random() * 0.9, vy: 0.4 + Math.random() * 1.1, life: 26, max: 26, size: 3 })
        } else if (parts.length < 260) {
          for (let i = 0; i < 3; i++)
            parts.push({ x: mouse.x + (Math.random() - 0.5) * 5, y: mouse.y + 4, vx: (Math.random() - 0.5) * 0.7, vy: -1 - Math.random() * 1.3, life: 30 + Math.random() * 16, max: 46, size: 5 + Math.random() * 6 })
        }
      }
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        p.life -= 1
        if (p.life <= 0) {
          parts.splice(i, 1)
          continue
        }
        p.x += p.vx
        p.y += p.vy
        const t = p.life / p.max
        if (p.foam) {
          p.vy += 0.03
          ctx.fillStyle = `rgba(255,255,255,${t * 0.85})`
          ctx.strokeStyle = `rgba(150,170,190,${t * 0.5})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size + (1 - t) * 6, 0, 6.3)
          ctx.fill()
          ctx.stroke()
        } else {
          ctx.fillStyle = t > 0.66 ? `rgba(255,214,90,${t})` : t > 0.33 ? `rgba(255,120,30,${t + 0.2})` : `rgba(200,30,30,${t * 2})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * t + 1, 0, 6.3)
          ctx.fill()
        }
      }
      raf = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    document.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseleave', onLeave)
      document.documentElement.classList.remove('fire-cursor-on')
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="fire-canvas" aria-hidden="true" />
      <svg ref={extRef} className="fire-ext" viewBox="0 0 34 42" aria-hidden="true">
        <path d="M13 12 C 3 14, 3 28, 4 38" fill="none" stroke="#0b0f19" strokeWidth="3" strokeLinecap="round" />
        <rect x="2" y="35" width="5" height="6" rx="1.5" fill="#0b0f19" transform="rotate(8 4 38)" />
        <rect x="14" y="7" width="14" height="5" rx="2" fill="#0b0f19" />
        <rect x="12" y="2" width="14" height="3" rx="1.5" fill="#0b0f19" transform="rotate(-8 19 3)" />
        <rect x="13" y="11" width="16" height="28" rx="5" fill="#c1121f" stroke="#fff" strokeWidth="1.5" />
        <rect x="13" y="21" width="16" height="9" fill="#fff" opacity=".9" />
      </svg>
    </>
  )
}
