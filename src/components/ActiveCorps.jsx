import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, ChevronDown, ChevronUp } from 'lucide-react'
import { activeCorps } from '../data.js'
import './ActiveCorps.css'

const INITIAL_VISIBLE = 2

export default function ActiveCorps() {
  const [expanded, setExpanded] = useState(false)
  const hasMore = activeCorps.length > INITIAL_VISIBLE
  const visible = expanded ? activeCorps : activeCorps.slice(0, INITIAL_VISIBLE)

  return (
    <section id="cuerpo-activo">
      <div className="wrap">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow">La institución</span>
          <h2>Cuerpo Activo</h2>
        </motion.div>

        <div className="roster-grid">
          {visible.map((member, i) => (
            <motion.div
              key={member.id}
              className="roster-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <span className="roster-icon">
                <Shield size={18} />
              </span>
              <div>
                <p className="roster-name">
                  {member.firstName} {member.lastName}
                </p>
                <p className="roster-rank">{member.rank}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {hasMore && (
          <button type="button" className="see-more-btn" onClick={() => setExpanded((e) => !e)}>
            {expanded ? 'Ver menos' : 'Ver más'}
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>
    </section>
  )
}
