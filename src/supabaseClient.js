import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Si faltan las variables, el sitio sigue funcionando con el contenido de data.js
export const supabase = url && key ? createClient(url, key) : null
