import { motion } from 'framer-motion'
import { MapPin, ExternalLink } from 'lucide-react'
import { location } from '../data.js'
import './LocationMap.css'

export default function LocationMap() {
  const embedSrc = `https://www.google.com/maps?q=${location.lat},${location.lng}&z=16&output=embed`

  return (
    <section id="ubicacion">
      <div className="wrap">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow">Cómo llegar</span>
          <h2>Ubicación</h2>
          <p className="section-lead">{location.address}</p>
        </motion.div>

        <div className="map-frame">
          <iframe
            title="Ubicación del cuartel"
            src={embedSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <a className="map-link" href={location.mapsUrl} target="_blank" rel="noopener noreferrer">
          <MapPin size={16} />
          Ver en Google Maps
          <ExternalLink size={14} />
        </a>
      </div>
    </section>
  )
}
