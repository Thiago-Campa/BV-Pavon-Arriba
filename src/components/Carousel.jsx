import { useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { carouselImages, institution } from '../data.js'
import './Carousel.css'

const AUTO_ADVANCE_MS = 5000

export default function Carousel() {
  const [index, setIndex] = useState(0)

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % carouselImages.length)
  }, [])

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + carouselImages.length) % carouselImages.length)
  }, [])

  useEffect(() => {
    if (carouselImages.length <= 1) return
    const id = setInterval(next, AUTO_ADVANCE_MS)
    return () => clearInterval(id)
  }, [next])

  if (carouselImages.length === 0) return null

  const current = carouselImages[index]

  return (
    <section id="top" className="carousel" style={{ borderTop: 'none', padding: 0 }}>
      <div className="carousel-frame">
        <AnimatePresence mode="wait">
          <motion.img
            key={current.id}
            src={current.src}
            alt={current.alt}
            className="carousel-img"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        </AnimatePresence>

        <div className="carousel-overlay" />

        <div className="carousel-caption">
          <span className="carousel-kicker">{institution.town}</span>
          <h1>{institution.name}</h1>
        </div>

        {carouselImages.length > 1 && (
          <>
            <button type="button" className="carousel-arrow carousel-arrow--left" onClick={prev} aria-label="Foto anterior">
              <ChevronLeft size={22} />
            </button>
            <button type="button" className="carousel-arrow carousel-arrow--right" onClick={next} aria-label="Foto siguiente">
              <ChevronRight size={22} />
            </button>

            <div className="carousel-dots">
              {carouselImages.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  className={`carousel-dot${i === index ? ' carousel-dot--active' : ''}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Ir a la foto ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
