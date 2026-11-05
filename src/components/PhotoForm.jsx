import { useEffect, useState } from 'react'
import { api } from '../api.js'
import './Admin.css'

export default function PhotoForm({ onAdded, onCancel }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [caption, setCaption] = useState('')
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
    if (!file) return setError('Elegí una imagen.')
    setError('')
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      fd.append('caption', caption)
      const photo = await api.addPhoto(fd)
      onAdded(photo)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <h3>Agregar foto</h3>
      <label className="admin-field">
        Imagen (JPG, PNG, WEBP o GIF, hasta 8 MB)
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => setFile(e.target.files[0] || null)} />
      </label>
      {preview && <img src={preview} alt="Vista previa" className="admin-preview" />}
      <label className="admin-field">
        Descripción (opcional)
        <input value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={200} />
      </label>
      {error && <p className="admin-error">{error}</p>}
      <div className="admin-actions">
        <button type="button" className="admin-btn" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
          {loading ? 'Subiendo…' : 'Publicar'}
        </button>
      </div>
    </form>
  )
}
