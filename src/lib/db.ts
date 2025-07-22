import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

export interface User {
  id: string
  email: string
  passwordHash: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  website: string
  status: 'active' | 'pending' | 'inactive'
  value: number
  lastContact: string
  avatar?: string
}

interface DB {
  users: User[]
  sessions: Record<string, string>
  customers: Record<string, Customer[]>
}

const dbPath = path.join(process.cwd(), 'data', 'db.json')

function ensureDB(): DB {
  if (!fs.existsSync(dbPath)) {
    const init: DB = { users: [], sessions: {}, customers: {} }
    fs.mkdirSync(path.dirname(dbPath), { recursive: true })
    fs.writeFileSync(dbPath, JSON.stringify(init, null, 2))
    return init
  }
  const raw = fs.readFileSync(dbPath, 'utf8')
  return JSON.parse(raw)
}

function writeDB(db: DB) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
}

export function createUser(email: string, passwordHash: string) {
  const db = ensureDB()
  if (db.users.find(u => u.email === email)) {
    throw new Error('User already exists')
  }
  const user: User = { id: randomUUID(), email, passwordHash }
  db.users.push(user)
  writeDB(db)
  return user
}

export function findUserByEmail(email: string): User | undefined {
  const db = ensureDB()
  return db.users.find(u => u.email === email)
}

export function findUserById(id: string): User | undefined {
  const db = ensureDB()
  return db.users.find(u => u.id === id)
}

export function createSession(userId: string) {
  const db = ensureDB()
  const token = randomUUID()
  db.sessions[token] = userId
  writeDB(db)
  return token
}

export function getUserIdFromSession(token: string | undefined): string | undefined {
  if (!token) return undefined
  const db = ensureDB()
  return db.sessions[token]
}

export function clearSession(token: string) {
  const db = ensureDB()
  delete db.sessions[token]
  writeDB(db)
}

export function getCustomers(userId: string): Customer[] {
  const db = ensureDB()
  return db.customers[userId] ?? []
}

export function saveCustomers(userId: string, customers: Customer[]) {
  const db = ensureDB()
  db.customers[userId] = customers
  writeDB(db)
}
