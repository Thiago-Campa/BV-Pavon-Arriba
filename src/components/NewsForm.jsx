import { useEffect, useState } from 'react'
import { api } from '../api.js'
import './Admin.css'

const today = () => new Date().toISOString().slice(0, 10)

export default function NewsForm({ onAdded, onCancel }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [date, setDate] = useState(today())
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!file) return setPreview('')
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', title)
      fd.append('body', body)
      fd.append('date', date)
      if (file) fd.append('image', file)
      const item = await api.addNews(fd)
      onAdded(item)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <h3>Agregar noticia</h3>
      <label className="admin-field">
        Título
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} required />
      </label>
      <label className="admin-field">
        Fecha
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </label>
      <label className="admin-field">
        Texto
        <textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={5000} required />
      </label>
      <label className="admin-field">
        Imagen (opcional)
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => setFile(e.target.files[0] || null)} />
      </label>
      {preview && <img src={preview} alt="Vista previa" className="admin-preview" />}
      {error && <p className="admin-error">{error}</p>}
      <div className="admin-actions">
        <button type="button" className="admin-btn" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
          {loading ? 'Publicando…' : 'Publicar'}
        </button>
      </div>
    </form>
  )
}
