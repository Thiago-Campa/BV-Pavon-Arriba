import { motion } from 'framer-motion'
import { Mail, Phone, Facebook, Instagram, MessageCircle } from 'lucide-react'
import { institution, socials } from '../data.js'
import './Contact.css'

const ICONS = { Facebook, Instagram, MessageCircle }

export default function Contact() {
  return (
    <section id="contacto">
      <div className="wrap">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow">Hablemos</span>
          <h2>Contacto</h2>
          <p className="section-lead">
            Para consultas, propuestas o donaciones, escribinos por cualquiera de estos medios.
          </p>
        </motion.div>

        <motion.div
          className="contact-panel"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="contact-direct">
            <a className="contact-row" href={`tel:${institution.guardPhoneTel}`}>
              <Phone size={18} />
              <span>{institution.guardPhoneDisplay}</span>
            </a>
            <a className="contact-row" href={`mailto:${institution.email}`}>
              <Mail size={18} />
              <span>{institution.email}</span>
            </a>
          </div>

          <div className="social-grid">
            {socials.map((social) => {
              const Icon = ICONS[social.icon]
              return (
                <a key={social.key} className="social-chip" href={social.url} target="_blank" rel="noopener noreferrer">
                  <Icon size={17} />
                  <span>{social.label}</span>
                </a>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
