import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { news } from '../data.js'
import './News.css'

function formatDate(iso) {
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export default function News() {
  const sorted = [...news].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <section id="noticias">
      <div className="wrap">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow">Al día</span>
          <h2>Noticias</h2>
        </motion.div>

        <div className="news-list">
          {sorted.map((item, i) => (
            <motion.article
              key={item.id}
              className="news-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              {item.image && (
                <div className="news-image">
                  <img src={item.image} alt={item.title} />
                </div>
              )}
              <div className="news-body">
                <span className="news-date">
                  <Calendar size={13} />
                  {formatDate(item.date)}
                </span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
