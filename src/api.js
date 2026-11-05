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
  if (/multiple \(or no\) rows/i.test(msg))
    return 'No se pudo guardar el cambio. Puede que ya no exista o que no tengas permisos de administrador.'
  if (/violates check constraint/i.test(msg)) return 'Alguno de los datos no es válido.'
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

// Borra el archivo de Storage si la imagen fue subida desde el panel.
// Las fotos que vienen con el proyecto (/gallery/...) no están en Storage y se dejan como están.
async function removeStored(bucket, url) {
  if (!url) return
  const marker = `/storage/v1/object/public/${bucket}/`
  const i = url.indexOf(marker)
  if (i === -1) return
  const path = decodeURIComponent(url.slice(i + marker.length).split('?')[0])
  try {
    await client().storage.from(bucket).remove([path])
  } catch {
    // si falla el borrado del archivo no pasa nada grave: el registro ya se eliminó
  }
}

async function deleteRow(table, id) {
  const { data, error } = await client().from(table).delete().eq('id', id).select('id')
  if (error) throw new Error(friendly(error))
  if (!data || data.length === 0) {
    throw new Error('No se pudo eliminar. Puede que ya no exista o que no tengas permisos de administrador.')
  }
}

const mapPerson = (r, key) => ({ id: r.id, firstName: r.first_name, lastName: r.last_name, [key]: r[key] })

export const api = {
  /* ---------- Fotos ---------- */
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
    if (error) {
      await removeStored('gallery', src)
      throw new Error(friendly(error))
    }
    return data
  },

  async deletePhoto(photo) {
    await deleteRow('photos', photo.id)
    await removeStored('gallery', photo.src)
  },

  /* ---------- Noticias ---------- */
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
    if (error) {
      await removeStored('news', image)
      throw new Error(friendly(error))
    }
    return data
  },

  async updateNews({ id, title, body, date, file, removeImage, currentImage }) {
    let image = currentImage || ''
    let uploaded = ''
    if (file) {
      uploaded = await uploadImage('news', file)
      image = uploaded
    } else if (removeImage) {
      image = ''
    }
    const { data, error } = await client()
      .from('news')
      .update({ title: title.trim(), body: body.trim(), date, image })
      .eq('id', id)
      .select('id, date, title, body, image')
      .single()
    if (error) {
      await removeStored('news', uploaded)
      throw new Error(friendly(error))
    }
    if ((file || removeImage) && currentImage) await removeStored('news', currentImage)
    return data
  },

  async deleteNews(item) {
    await deleteRow('news', item.id)
    await removeStored('news', item.image)
  },

  /* ---------- Cuerpo activo ---------- */
  async getMembers() {
    const { data, error } = await client().from('members').select('id, first_name, last_name, rank').order('id')
    if (error) throw new Error(friendly(error))
    return data.map((r) => mapPerson(r, 'rank'))
  },

  async addMember({ firstName, lastName, rank }) {
    const { data, error } = await client()
      .from('members')
      .insert({ first_name: firstName.trim(), last_name: lastName.trim(), rank })
      .select('id, first_name, last_name, rank')
      .single()
    if (error) throw new Error(friendly(error))
    return mapPerson(data, 'rank')
  },

  deleteMember: (id) => deleteRow('members', id),

  /* ---------- Comisión directiva ---------- */
  async getBoard() {
    const { data, error } = await client().from('board_members').select('id, first_name, last_name, role').order('id')
    if (error) throw new Error(friendly(error))
    return data.map((r) => mapPerson(r, 'role'))
  },

  async addBoardMember({ firstName, lastName, role }) {
    const { data, error } = await client()
      .from('board_members')
      .insert({ first_name: firstName.trim(), last_name: lastName.trim(), role })
      .select('id, first_name, last_name, role')
      .single()
    if (error) throw new Error(friendly(error))
    return mapPerson(data, 'role')
  },

  deleteBoardMember: (id) => deleteRow('board_members', id),
}

export { friendly }
