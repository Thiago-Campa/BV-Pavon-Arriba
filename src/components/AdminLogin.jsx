import { useState } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNotify } from '../context/NotifyContext.jsx'
import './Admin.css'

export default function AdminLogin({ onClose }) {
  const { login } = useAuth()
  const { notify } = useNotify()
  const [mail, setMail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(mail, password)
      notify('Sesión iniciada. Ya podés administrar el contenido.')
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-overlay" onClick={onClose}>
      <form className="login-modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <button type="button" className="login-close" onClick={onClose} aria-label="Cerrar">
          <X size={18} />
        </button>
        <h3>Acceso administración</h3>
        <label className="admin-field">
          Email
          <input type="email" value={mail} onChange={(e) => setMail(e.target.value)} autoComplete="email" required autoFocus />
        </label>
        <label className="admin-field">
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p className="admin-error">{error}</p>}
        <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
