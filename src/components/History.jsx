import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Pencil } from 'lucide-react'
import { historyParagraphs } from '../data.js'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useNotify } from '../context/NotifyContext.jsx'
import './Admin.css'
import './History.css'

// El texto se guarda completo; los párrafos se separan con una línea en blanco.
const toParagraphs = (text) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

export default function History() {
  const { isAdmin } = useAuth()
  const { notify } = useNotify()
  const [paragraphs, setParagraphs] = useState(historyParagraphs)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api
      .getContent('history')
      .then((value) => {
        if (value) setParagraphs(toParagraphs(value))
      })
      .catch(() => {}) // si el servidor no responde, se muestra el texto de data.js
  }, [])

  const startEdit = () => {
    setDraft(paragraphs.join('\n\n'))
    setError('')
    setEditing(true)
  }

  const save = async (e) => {
    e.preventDefault()
    if (!draft.trim()) return setError('El texto no puede quedar vacío.')
    setError('')
    setLoading(true)
    try {
      const value = await api.saveContent('history', draft)
      setParagraphs(toParagraphs(value))
      setEditing(false)
      notify('Historia modificada.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

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

        {isAdmin && !editing && (
          <div className="admin-bar">
            <button type="button" className="admin-add-btn" onClick={startEdit}>
              <Pencil size={15} /> Modificar historia
            </button>
          </div>
        )}

        {editing ? (
          <form className="admin-form" onSubmit={save}>
            <h3>Modificar historia</h3>
            <label className="admin-field">
              Texto (separá los párrafos con una línea en blanco)
              <textarea
                className="history-textarea"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={20000}
                required
                autoFocus
              />
            </label>
            {error && <p className="admin-error">{error}</p>}
            <div className="admin-actions">
              <button type="button" className="admin-btn" onClick={() => setEditing(false)}>
                Cancelar
              </button>
              <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
                {loading ? 'Guardando…' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        ) : (
          <div className="history-body">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  )
}
