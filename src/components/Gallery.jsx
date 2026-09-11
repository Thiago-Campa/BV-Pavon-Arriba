import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { galleryPhotos } from '../data.js'
import './Gallery.css'

const INITIAL_VISIBLE = 4
const LONG_PRESS_MS = 400

export default function Gallery() {
  const [selected, setSelected] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [zoomedId, setZoomedId] = useState(null)
  const timerRef = useRef(null)
  const suppressClickRef = useRef(false)

  const hasMore = galleryPhotos.length > INITIAL_VISIBLE
  const visible = expanded ? galleryPhotos : galleryPhotos.slice(0, INITIAL_VISIBLE)

  const startPress = (id) => {
    suppressClickRef.current = false
    timerRef.current = setTimeout(() => {
      setZoomedId(id)
      suppressClickRef.current = true
    }, LONG_PRESS_MS)
  }

  const endPress = () => {
    clearTimeout(timerRef.current)
    setZoomedId(null)
  }

  const handleClick = (item) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }
    setSelected(item)
  }

  return (
    <section id="fotos">
      <div className="wrap">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow">Momentos</span>
          <h2>Fotos</h2>
          <p className="section-lead">Pasá el cursor o mantené el dedo sobre una foto para verla más grande. Tocala para abrirla en pantalla completa.</p>
        </motion.div>

        <div className="gallery-grid">
          {visible.map((item, i) => (
            <motion.button
              key={item.id}
              type="button"
              className={`gallery-item${zoomedId === item.id ? ' gallery-item--zoomed' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => handleClick(item)}
              onTouchStart={() => startPress(item.id)}
              onTouchEnd={endPress}
              onTouchCancel={endPress}
            >
              <img src={item.src} alt={item.caption} loading="lazy" />
              {item.caption && <span className="gallery-caption">{item.caption}</span>}
            </motion.button>
          ))}
        </div>

        {hasMore && (
          <button type="button" className="see-more-btn see-more-btn--red" onClick={() => setExpanded((e) => !e)}>
            {expanded ? 'Ver menos' : 'Ver más'}
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button type="button" className="lightbox-close" onClick={() => setSelected(null)} aria-label="Cerrar">
                <X size={20} />
              </button>
              <img src={selected.src} alt={selected.caption} />
              {selected.caption && <p className="lightbox-caption">{selected.caption}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}