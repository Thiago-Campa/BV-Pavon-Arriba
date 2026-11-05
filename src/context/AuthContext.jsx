import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api, clearToken, getToken, setToken } from '../api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [username, setUsername] = useState('')

  // Al cargar, si hay un token guardado, verificamos que siga siendo válido.
  useEffect(() => {
    if (!getToken()) return
    api
      .me()
      .then((d) => {
        setIsAdmin(true)
        setUsername(d.username)
      })
      .catch(() => clearToken())
  }, [])

  const login = useCallback(async (user, password) => {
    const d = await api.login(user, password)
    setToken(d.token)
    setIsAdmin(true)
    setUsername(d.username)
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setIsAdmin(false)
    setUsername('')
  }, [])

  return <AuthContext.Provider value={{ isAdmin, username, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
