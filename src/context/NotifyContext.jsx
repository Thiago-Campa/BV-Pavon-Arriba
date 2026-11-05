import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import '../components/Notify.css'

const NotifyContext = createContext(null)
let nextId = 1

const ICONS = {
  success: <CheckCircle2 size={20} />,
  error: <AlertCircle size={20} />,
  info: <Info size={20} />,
}

export function NotifyProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [dialog, setDialog] = useState(null) // { options, resolve }
  const cancelRef = useRef(null)

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), [])

  // Cartel de notificación: notify('Texto', 'success' | 'error' | 'info')
  const notify = useCallback(
    (message, type = 'success') => {
      const id = nextId++
      setToasts((list) => [...list.slice(-3), { id, message, type }])
      setTimeout(() => dismiss(id), type === 'error' ? 6000 : 4000)
    },
    [dismiss],
  )

  // Cartel de confirmación: const ok = await confirm({ title, message, confirmText })
  const confirm = useCallback((options) => new Promise((resolve) => setDialog({ options, resolve })), [])

  const close = (result) => {
    if (dialog) dialog.resolve(result)
    setDialog(null)
  }

  useEffect(() => {
    if (!dialog) return undefined
    cancelRef.current?.focus() // el foco arranca en "Cancelar" para evitar borrados por error
    const onKey = (e) => {
      if (e.key === 'Escape') {
        dialog.resolve(false)
        setDialog(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dialog])

  const value = useMemo(() => ({ notify, confirm }), [notify, confirm])
  const opts = dialog?.options

  return (
    <NotifyContext.Provider value={value}>
      {children}

      <div className="toast-stack" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.type}`} role={t.type === 'error' ? 'alert' : 'status'}>
            <span className="toast-icon">{ICONS[t.type] || ICONS.info}</span>
            <p>{t.message}</p>
            <button type="button" className="toast-close" onClick={() => dismiss(t.id)} aria-label="Cerrar aviso">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {dialog && (
        <div className="confirm-overlay" onClick={() => close(false)}>
          <div
            className="confirm-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-msg"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="confirm-icon">
              <AlertTriangle size={24} />
            </span>
            <h3 id="confirm-title">{opts.title || '¿Estás seguro?'}</h3>
            <p id="confirm-msg">{opts.message}</p>
            <div className="confirm-actions">
              <button type="button" ref={cancelRef} className="confirm-btn" onClick={() => close(false)}>
                Cancelar
              </button>
              <button type="button" className="confirm-btn confirm-btn--danger" onClick={() => close(true)}>
                {opts.confirmText || 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </NotifyContext.Provider>
  )
}

export function useNotify() {
  const ctx = useContext(NotifyContext)
  if (!ctx) throw new Error('useNotify debe usarse dentro de NotifyProvider')
  return ctx
}
