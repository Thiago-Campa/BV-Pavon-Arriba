import { supabase } from './supabaseClient.js'

const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }
const MAX_BYTES = 8 * 1024 * 1024

function client() {
  if (!supabase) throw new Error('Falta configurar Supabase (variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY).')
  return supabase
}

function friendly(error) {
  const msg = error?.message || 'Ocurrió un error.'
  if (/row-level security|permission denied/i.test(msg)) return 'No tenés permisos de administrador.'
  if (/Invalid login credentials/i.test(msg)) return 'Email o contraseña incorrectos.'
  return msg
}

async function uploadImage(bucket, file) {
  if (!EXT[file.type]) throw new Error('Solo se permiten imágenes JPG, PNG, WEBP o GIF.')
  if (file.size > MAX_BYTES) throw new Error('La imagen supera los 8 MB.')
  const sb = client()
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${EXT[file.type]}`
  const { error } = await sb.storage.from(bucket).upload(name, file, {
    contentType: file.type,
    cacheControl: '31536000',
  })
  if (error) throw new Error(friendly(error))
  return sb.storage.from(bucket).getPublicUrl(name).data.publicUrl
}

export const api = {
  async getPhotos() {
    const { data, error } = await client()
      .from('photos')
      .select('id, src, caption')
      .order('id', { ascending: false })
    if (error) throw new Error(friendly(error))
    return data
  },

  async addPhoto({ file, caption }) {
    const src = await uploadImage('gallery', file)
    const { data, error } = await client()
      .from('photos')
      .insert({ src, caption: caption.trim().slice(0, 200) })
      .select('id, src, caption')
      .single()
    if (error) throw new Error(friendly(error))
    return data
  },

  async getNews() {
    const { data, error } = await client()
      .from('news')
      .select('id, date, title, body, image')
      .order('date', { ascending: false })
      .order('id', { ascending: false })
    if (error) throw new Error(friendly(error))
    return data
  },

  async addNews({ title, body, date, file }) {
    const image = file ? await uploadImage('news', file) : ''
    const { data, error } = await client()
      .from('news')
      .insert({ title: title.trim(), body: body.trim(), date, image })
      .select('id, date, title, body, image')
      .single()
    if (error) throw new Error(friendly(error))
    return data
  },
}

export { friendly }
