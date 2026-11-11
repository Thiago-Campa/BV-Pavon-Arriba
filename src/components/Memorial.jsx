import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { memorial } from '../data.js'
import './Memorial.css'

const LONG_PRESS_MS = 400

export default function Memorial() {
  const [zoomed, setZoomed] = useState(false)
  const [lit, setLit] = useState(false)
  const timerRef = useRef(null)

  const startPress = () => {
    timerRef.current = setTimeout(() => setZoomed(true), LONG_PRESS_MS)
  }

  const endPress = () => {
    clearTimeout(timerRef.current)
    setZoomed(false)
  }

  return (
    <section id="memoria" className="memorial-section">
      <div className="wrap">
        <motion.div
          className="memorial-card"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <div
            className={`memorial-photo${zoomed ? ' memorial-photo--zoomed' : ''}`}
            onTouchStart={startPress}
            onTouchEnd={endPress}
            onTouchCancel={endPress}
          >
            <img src={memorial.photo} alt={memorial.name} />
          </div>
          <div className="memorial-text">
            <span className="memorial-eyebrow">
              <Flame size={14} />
              En memoria
            </span>
            <h2>{memorial.name}</h2>
            <p className="memorial-role">
              {memorial.role}
              {memorial.years && <span> · {memorial.years}</span>}
            </p>
            <p className="memorial-tribute">{memorial.tribute}</p>
            <button type="button" className={`candle-btn${lit ? ' candle-btn--lit' : ''}`} onClick={() => setLit((l) => !l)} aria-pressed={lit}>
              <span className="candle" aria-hidden="true">
                <i className="candle-flame" />
                <i className="candle-wax" />
              </span>
              {lit ? 'Vela encendida' : 'Encender una vela'}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}