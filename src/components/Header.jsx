import { useState } from 'react'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'
import { institution } from '../data.js'
import './Header.css'

const NAV_ITEMS = [
  { href: '#historia', label: 'Historia' },
  { href: '#cuerpo-activo', label: 'Cuerpo Activo' },
  { href: '#comision', label: 'Comisión' },
  { href: '#noticias', label: 'Noticias' },
  { href: '#fotos', label: 'Fotos' },
  { href: '#memoria', label: 'Memoria' },
  { href: '#ubicacion', label: 'Ubicación' },
  { href: '#contacto', label: 'Contacto' },
]

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <header className="header">
      <div className="wrap header-inner">
        <a href="#top" className="header-brand" onClick={() => setOpen(false)}>
          <img src={institution.logo} alt="Logo del cuartel" className="header-logo" />
          <span>{institution.name}</span>
        </a>

        <nav className="header-nav">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="theme-btn"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
            title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <button
            type="button"
            className="theme-btn menu-btn"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="mobile-nav">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
