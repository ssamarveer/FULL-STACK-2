const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const app = express()
const PORT = 5050
const JWT_SECRET = process.env.JWT_SECRET || 'post-composer-demo-secret-change-me'
const DATA = __dirname
const USERS_FILE = path.join(DATA, 'users.json')
const POSTS_FILE = path.join(DATA, 'posts.json')

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

function read(file, fallback) { try { return JSON.parse(fs.readFileSync(file, 'utf8')) } catch { return fallback } }
function write(file, value) { fs.writeFileSync(file, JSON.stringify(value, null, 2)) }
function hash(password, salt) { return crypto.scryptSync(password, salt, 64).toString('hex') }
function makePassword(password) { const salt = crypto.randomBytes(16).toString('hex'); return `${salt}:${hash(password, salt)}` }
function checkPassword(password, stored) { const [salt, key] = stored.split(':'); return key && crypto.timingSafeEqual(Buffer.from(hash(password, salt), 'hex'), Buffer.from(key, 'hex')) }
function safeUser(u) { return { id: u.id, username: u.username, role: u.role, createdAt: u.createdAt } }
function ensureAdmin() {
  const users = read(USERS_FILE, [])
  if (!users.some(u => u.username === 'admin')) {
    users.push({ id: crypto.randomUUID(), username: 'admin', password: makePassword('admin123'), role: 'Admin', createdAt: new Date().toISOString() })
    write(USERS_FILE, users)
  }
}
ensureAdmin()

function auth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ message: 'Authentication required' })
  try { req.payload = jwt.verify(token, JWT_SECRET); next() } catch { return res.status(401).json({ message: 'Invalid or expired JWT' }) }
}
function role(...roles) { return (req, res, next) => roles.includes(req.payload.role) ? next() : res.status(403).json({ message: 'You do not have permission for this action' }) }

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'Post Composer API' }))

app.post('/api/auth/register', (req, res) => {
  const username = String(req.body.username || '').trim()
  const password = String(req.body.password || '')
  if (username.length < 3 || password.length < 6) return res.status(400).json({ message: 'Username must be 3+ chars and password 6+ chars' })
  const users = read(USERS_FILE, [])
  if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) return res.status(409).json({ message: 'Username already exists' })
  const user = { id: crypto.randomUUID(), username, password: makePassword(password), role: 'Viewer', createdAt: new Date().toISOString() }
  users.push(user); write(USERS_FILE, users)
  res.status(201).json({ user: safeUser(user) })
})

app.post('/api/auth/login', (req, res) => {
  const username = String(req.body.username || '').trim()
  const password = String(req.body.password || '')
  const users = read(USERS_FILE, [])
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase())
  if (!user || !checkPassword(password, user.password)) return res.status(401).json({ message: 'Invalid username or password' })
  const token = jwt.sign({ sub: user.id, username: user.username, role: user.role, iss: 'post-composer' }, JWT_SECRET, { expiresIn: '8h' })
  res.json({ token, user: safeUser(user) })
})

app.get('/api/auth/me', auth, (req, res) => {
  const user = read(USERS_FILE, []).find(u => u.id === req.payload.sub)
  if (!user) return res.status(401).json({ message: 'User not found' })
  res.json({ user: safeUser(user), payload: req.payload })
})

app.get('/api/posts', auth, (req, res) => res.json({ posts: read(POSTS_FILE, []) }))

app.post('/api/posts', auth, role('Admin'), (req, res) => {
  const { text, platforms, media, overrides } = req.body
  if (!String(text || '').trim() || !Array.isArray(platforms) || platforms.length === 0) return res.status(400).json({ message: 'Text and at least one platform are required' })
  const posts = read(POSTS_FILE, [])
  const now = new Date().toISOString()
  const post = { id: crypto.randomUUID(), text: String(text), platforms, media: media || { images: 0, videos: 0 }, overrides: overrides || {}, createdBy: req.payload.username, createdAt: now, updatedAt: now }
  posts.unshift(post); write(POSTS_FILE, posts)
  res.status(201).json({ post })
})

app.put('/api/posts/:id', auth, role('Admin', 'Editor'), (req, res) => {
  const posts = read(POSTS_FILE, [])
  const index = posts.findIndex(p => p.id === req.params.id)
  if (index < 0) return res.status(404).json({ message: 'Post not found' })
  const current = posts[index]
  posts[index] = { ...current, text: String(req.body.text ?? current.text), platforms: req.body.platforms || current.platforms, media: req.body.media || current.media, overrides: req.body.overrides || current.overrides, updatedAt: new Date().toISOString(), updatedBy: req.payload.username }
  write(POSTS_FILE, posts); res.json({ post: posts[index] })
})

app.delete('/api/posts/:id', auth, role('Admin', 'Editor'), (req, res) => {
  const posts = read(POSTS_FILE, [])
  const next = posts.filter(p => p.id !== req.params.id)
  if (next.length === posts.length) return res.status(404).json({ message: 'Post not found' })
  write(POSTS_FILE, next); res.json({ ok: true })
})

app.get('/api/admin/users', auth, role('Admin'), (req, res) => res.json({ users: read(USERS_FILE, []).map(safeUser) }))
app.patch('/api/admin/users/:id/role', auth, role('Admin'), (req, res) => {
  const allowed = ['Admin', 'Editor', 'Viewer']
  if (!allowed.includes(req.body.role)) return res.status(400).json({ message: 'Invalid role' })
  const users = read(USERS_FILE, [])
  const user = users.find(u => u.id === req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  user.role = req.body.role; write(USERS_FILE, users); res.json({ user: safeUser(user) })
})

app.listen(PORT, () => console.log(`Post Composer API running at http://localhost:${PORT}`))
