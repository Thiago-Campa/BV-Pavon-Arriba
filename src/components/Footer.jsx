import { useState } from 'react'
import { institution } from '../data.js'
import { useAuth } from '../context/AuthContext.jsx'
import AdminLogin from './AdminLogin.jsx'
import './Footer.css'

export default function Footer() {
  const { isAdmin, logout } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  return (
    <footer>
      <div className="wrap">
        © {new Date().getFullYear()} {institution.name} — {institution.town}
        {isAdmin ? (
          <button type="button" className="admin-link" onClick={logout}>
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
