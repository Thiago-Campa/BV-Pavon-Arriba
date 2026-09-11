import { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, ChevronDown, ChevronUp } from 'lucide-react'
import { board } from '../data.js'
import './Board.css'

const INITIAL_VISIBLE = 2

export default function Board() {
  const [expanded, setExpanded] = useState(false)
  const hasMore = board.length > INITIAL_VISIBLE
  const visible = expanded ? board : board.slice(0, INITIAL_VISIBLE)

  return (
    <section id="comision">
      <div className="wrap">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow">La institución</span>
          <h2>Comisión Directiva</h2>
        </motion.div>

        <div className="board-grid">
          {visible.map((member, i) => (
            <motion.div
              key={member.id}
              className="board-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <span className="board-icon">
                <Award size={18} />
              </span>
              <div>
                <p className="board-name">
                  {member.firstName} {member.lastName}
                </p>
                <p className="board-role">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {hasMore && (
          <button type="button" className="see-more-btn see-more-btn--gold" onClick={() => setExpanded((e) => !e)}>
            {expanded ? 'Ver menos' : 'Ver más'}
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>
    </section>
  )
}
