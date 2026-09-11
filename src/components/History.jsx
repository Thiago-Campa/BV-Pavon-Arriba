import { motion } from 'framer-motion'
import { historyParagraphs } from '../data.js'
import './History.css'

export default function History() {
  return (
    <section id="historia">
      <motion.div
        className="wrap history-wrap"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <div className="section-head">
          <span className="section-eyebrow">Nuestra historia</span>
          <h2>Quiénes somos</h2>
        </div>
        <div className="history-body">
          {historyParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
