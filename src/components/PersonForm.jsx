import { useState } from 'react'
import './Admin.css'

// Formulario para agregar una persona (Cuerpo Activo o Comisión Directiva).
// onSubmit({ firstName, lastName, value }) debe devolver una promesa; si falla, el error se muestra acá.
export default function PersonForm({ title, selectLabel, options, onSubmit, onCancel }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!value) return setError(`Elegí ${selectLabel.toLowerCase()}.`)
    setError('')
    setLoading(true)
    try {
      await onSubmit({ firstName: firstName.trim(), lastName: lastName.trim(), value })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <h3>{title}</h3>
      <label className="admin-field">
        Nombre
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} maxLength={60} required autoFocus />
      </label>
      <label className="admin-field">
        Apellido
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} maxLength={60} required />
      </label>
      <label className="admin-field">
        {selectLabel}
        <select value={value} onChange={(e) => setValue(e.target.value)} required>
          <option value="">Elegí una opción…</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </label>
      {error && <p className="admin-error">{error}</p>}
      <div className="admin-actions">
        <button type="button" className="admin-btn" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
          {loading ? 'Guardando…' : 'Agregar'}
        </button>
      </div>
    </form>
  )
}
