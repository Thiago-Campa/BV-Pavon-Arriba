import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'
import { friendly } from '../api.js'

const AuthContext = createContext(null)

async function checkAdmin(userId) {
  const { data } = await supabase.from('admins').select('user_id').eq('user_id', userId).maybeSingle()
  return Boolean(data)
}

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [email, setEmail] = useState('')

  // Al cargar, si ya había una sesión guardada, verificamos que sea de un admin.
  useEffect(() => {
    if (!supabase) return
    let active = true

    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user
      if (!user) return
      const ok = await checkAdmin(user.id)
      if (active && ok) {
        setIsAdmin(true)
        setEmail(user.email || '')
      }
    })

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setIsAdmin(false)
        setEmail('')
      }
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(async (mail, password) => {
    if (!supabase) throw new Error('Falta configurar Supabase.')
    const { data, error } = await supabase.auth.signInWithPassword({ email: mail.trim(), password })
    if (error) throw new Error(friendly(error))
    const ok = await checkAdmin(data.user.id)
    if (!ok) {
      await supabase.auth.signOut()
      throw new Error('Esta cuenta no es de administrador.')
    }
    setIsAdmin(true)
    setEmail(data.user.email || '')
  }, [])

  const logout = useCallback(async () => {
    if (supabase) await supabase.auth.signOut()
    setIsAdmin(false)
    setEmail('')
  }, [])

  return <AuthContext.Provider value={{ isAdmin, email, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
