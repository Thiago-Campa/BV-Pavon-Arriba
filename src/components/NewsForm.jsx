import { useEffect, useState } from 'react'
import { api } from '../api.js'
import './Admin.css'

const today = () => new Date().toISOString().slice(0, 10)

// Sirve para agregar una noticia nueva y también para modificar una existente (prop "initial").
export default function NewsForm({ initial, onSaved, onCancel }) {
  const editing = Boolean(initial)
  const [title, setTitle] = useState(initial?.title ?? '')
  const [body, setBody] = useState(initial?.body ?? '')
  const [date, setDate] = useState(initial?.date ?? today())
  const [file, setFile] = useState(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!file) return setPreview('')
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const currentImage = editing && !removeImage ? initial.image : ''
  const shown = preview || currentImage

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const item = editing
        ? await api.updateNews({ id: initial.id, title, body, date, file, removeImage, currentImage: initial.image })
        : await api.addNews({ title, body, date, file })
      onSaved(item)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <h3>{editing ? 'Modificar noticia' : 'Agregar noticia'}</h3>
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
        {editing && initial.image ? 'Reemplazar imagen (opcional)' : 'Imagen (opcional)'}
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => setFile(e.target.files[0] || null)} />
      </label>
      {editing && initial.image && !file && (
        <label className="admin-check">
          <input type="checkbox" checked={removeImage} onChange={(e) => setRemoveImage(e.target.checked)} />
          Quitar la imagen actual
        </label>
      )}
      {shown && <img src={shown} alt="Vista previa" className="admin-preview" />}
      {error && <p className="admin-error">{error}</p>}
      <div className="admin-actions">
        <button type="button" className="admin-btn" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
          {loading ? 'Guardando…' : editing ? 'Guardar cambios' : 'Publicar'}
        </button>
      </div>
    </form>
  )
}
