import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SECRET_FILE = path.join(__dirname, 'data', '.secret')

function loadSecret() {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET
  if (fs.existsSync(SECRET_FILE)) return fs.readFileSync(SECRET_FILE, 'utf8')
  const s = crypto.randomBytes(32).toString('hex')
  fs.mkdirSync(path.dirname(SECRET_FILE), { recursive: true })
  fs.writeFileSync(SECRET_FILE, s, { mode: 0o600 })
  return s
}

const SECRET = loadSecret()
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12 // 12 horas

const b64 = (buf) => Buffer.from(buf).toString('base64url')

export function signToken(username) {
  const payload = b64(JSON.stringify({ u: username, exp: Date.now() + TOKEN_TTL_MS }))
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

export function verifyToken(token) {
  if (!token || !token.includes('.')) return null
  const [payload, sig] = token.split('.')
  const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (!data.exp || data.exp < Date.now()) return null
    return data
  } catch {
    return null
  }
}

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  const data = verifyToken(token)
  if (!data) return res.status(401).json({ error: 'No autorizado. Iniciá sesión como administrador.' })
  req.admin = data.u
  next()
}
