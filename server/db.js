import { DatabaseSync } from 'node:sqlite'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, 'data')
fs.mkdirSync(DATA_DIR, { recursive: true })

export const db = new DatabaseSync(path.join(DATA_DIR, 'bomberos.db'))
db.exec('PRAGMA journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    src TEXT NOT NULL,
    caption TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    image TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`)

/* ---------- Contraseñas ---------- */
export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return { hash, salt }
}

export function verifyPassword(password, hash, salt) {
  const test = crypto.scryptSync(password, salt, 64)
  const real = Buffer.from(hash, 'hex')
  return test.length === real.length && crypto.timingSafeEqual(test, real)
}

/* ---------- Admin inicial ---------- */
export function ensureAdmin() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM admins').get().n
  if (count > 0) return

  const username = process.env.ADMIN_USER || 'admin'
  let password = process.env.ADMIN_PASSWORD
  let generated = false
  if (!password) {
    password = crypto.randomBytes(9).toString('base64url')
    generated = true
  }
  const { hash, salt } = hashPassword(password)
  db.prepare('INSERT INTO admins (username, password_hash, salt) VALUES (?, ?, ?)').run(username, hash, salt)

  console.log('\n=== Administrador creado ===')
  console.log(`Usuario:    ${username}`)
  if (generated) {
    console.log(`Contraseña: ${password}   (generada, anotala: no se vuelve a mostrar)`)
  } else {
    console.log('Contraseña: la que definiste en ADMIN_PASSWORD')
  }
  console.log('============================\n')
}

/* ---------- Datos iniciales (solo la primera vez) ---------- */
export function seedIfEmpty() {
  if (db.prepare('SELECT COUNT(*) AS n FROM photos').get().n === 0) {
    const ins = db.prepare('INSERT INTO photos (src, caption) VALUES (?, ?)')
    db.exec('BEGIN')
    try {
      for (let i = 12; i >= 1; i--) ins.run(`/gallery/galeria ${i}.png`, '')
      db.exec('COMMIT')
    } catch (err) {
      db.exec('ROLLBACK')
      throw err
    }
  }

  if (db.prepare('SELECT COUNT(*) AS n FROM news').get().n === 0) {
    db.prepare('INSERT INTO news (date, title, body, image) VALUES (?, ?, ?, ?)').run(
      '2026-09-12',
      'Ultima salida',
      'Socorrimos a dotacion correspondiente al cuartel de la localidad de Maximo Paz, por causa de un incedio forestal.',
      '',
    )
  }
}
