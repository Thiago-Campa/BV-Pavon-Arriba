import { useState } from 'react'
import { institution } from '../data.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useNotify } from '../context/NotifyContext.jsx'
import AdminLogin from './AdminLogin.jsx'
import './Footer.css'

export default function Footer() {
  const { isAdmin, logout } = useAuth()
  const { notify } = useNotify()
  const [showLogin, setShowLogin] = useState(false)

  const handleLogout = async () => {
    await logout()
    notify('Cerraste la sesión de administrador.', 'info')
  }

  return (
    <footer>
      <div className="wrap">
        © {new Date().getFullYear()} {institution.name} — {institution.town}
        {isAdmin ? (
          <button type="button" className="admin-link" onClick={handleLogout}>
            Cerrar sesión de administrador
          </button>
        ) : (
          <button type="button" className="admin-link" onClick={() => setShowLogin(true)}>
            Administración
          </button>
        )}
      </div>
      {showLogin && <AdminLogin onClose={() => setShowLogin(false)} />}
    </footer>
  )
}
