import express from 'express'
import multer from 'multer'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { db, ensureAdmin, seedIfEmpty, verifyPassword } from './db.js'
import { requireAdmin, signToken } from './auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const UPLOADS = path.join(ROOT, 'uploads')
const PORT = process.env.PORT || 3001

fs.mkdirSync(path.join(UPLOADS, 'gallery'), { recursive: true })
fs.mkdirSync(path.join(UPLOADS, 'news'), { recursive: true })

ensureAdmin()
seedIfEmpty()

const app = express()
app.use(express.json({ limit: '100kb' }))
app.use('/uploads', express.static(UPLOADS, { maxAge: '7d' }))

/* ---------- Subida de imágenes ---------- */
const ALLOWED = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' }

function uploaderFor(folder) {
  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, path.join(UPLOADS, folder)),
      filename: (req, file, cb) =>
        cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ALLOWED[file.mimetype]}`),
    }),
    limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
    fileFilter: (req, file, cb) => {
      if (ALLOWED[file.mimetype]) return cb(null, true)
      cb(new Error('Solo se permiten imágenes JPG, PNG, WEBP o GIF.'))
    },
  })
}

const uploadGallery = uploaderFor('gallery')
const uploadNews = uploaderFor('news')

/* ---------- Login (con límite de intentos por IP) ---------- */
const attempts = new Map()
const MAX_ATTEMPTS = 8
const WINDOW_MS = 15 * 60 * 1000

function tooManyAttempts(ip) {
  const now = Date.now()
  const rec = attempts.get(ip)
  if (!rec || now - rec.first > WINDOW_MS) {
    attempts.set(ip, { first: now, count: 0 })
    return false
  }
  return rec.count >= MAX_ATTEMPTS
}

app.post('/api/login', (req, res) => {
  const ip = req.ip
  if (tooManyAttempts(ip)) {
    return res.status(429).json({ error: 'Demasiados intentos. Probá de nuevo en unos minutos.' })
  }
  const { username, password } = req.body || {}
  const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(String(username || ''))
  const ok = admin && verifyPassword(String(password || ''), admin.password_hash, admin.salt)
  if (!ok) {
    attempts.get(ip).count++
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' })
  }
  attempts.delete(ip)
  res.json({ token: signToken(admin.username), username: admin.username })
})

app.get('/api/me', requireAdmin, (req, res) => res.json({ username: req.admin }))

/* ---------- Fotos ---------- */
app.get('/api/photos', (req, res) => {
  res.json(db.prepare('SELECT id, src, caption FROM photos ORDER BY id DESC').all())
})

app.post('/api/photos', requireAdmin, uploadGallery.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Elegí una imagen.' })
  const caption = String(req.body.caption || '').trim().slice(0, 200)
  const src = `/uploads/gallery/${req.file.filename}`
  const info = db.prepare('INSERT INTO photos (src, caption) VALUES (?, ?)').run(src, caption)
  res.status(201).json({ id: info.lastInsertRowid, src, caption })
})

/* ---------- Noticias ---------- */
app.get('/api/news', (req, res) => {
  res.json(db.prepare('SELECT id, date, title, body, image FROM news ORDER BY date DESC, id DESC').all())
})

app.post('/api/news', requireAdmin, uploadNews.single('image'), (req, res) => {
  const title = String(req.body.title || '').trim().slice(0, 150)
  const body = String(req.body.body || '').trim().slice(0, 5000)
  let date = String(req.body.date || '').trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) date = new Date().toISOString().slice(0, 10)

  if (!title || !body) {
    if (req.file) fs.unlink(req.file.path, () => {})
    return res.status(400).json({ error: 'El título y el texto son obligatorios.' })
  }
  const image = req.file ? `/uploads/news/${req.file.filename}` : ''
  const info = db.prepare('INSERT INTO news (date, title, body, image) VALUES (?, ?, ?, ?)').run(date, title, body, image)
  res.status(201).json({ id: info.lastInsertRowid, date, title, body, image })
})

/* ---------- Errores (multer, etc.) ---------- */
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const msg = err.code === 'LIMIT_FILE_SIZE' ? 'La imagen supera los 8 MB.' : 'Error al subir la imagen.'
    return res.status(400).json({ error: msg })
  }
  if (err) return res.status(400).json({ error: err.message || 'Error inesperado.' })
  next()
})

/* ---------- Producción: servir el sitio compilado ---------- */
const DIST = path.join(ROOT, 'dist')
if (fs.existsSync(DIST)) {
  app.use(express.static(DIST))
  app.get(/^\/(?!api|uploads).*/, (req, res) => res.sendFile(path.join(DIST, 'index.html')))
}

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`))
