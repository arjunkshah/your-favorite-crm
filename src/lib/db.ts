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

export interface Deal {
  id: string
  title: string
  description: string
  value: number
  status: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost'
  priority: 'low' | 'medium' | 'high'
  customerId: string
  customerName: string
  customerCompany: string
  expectedCloseDate: string
  createdAt: string
  updatedAt: string
  assignedTo: string
  source: string
  tags: string[]
}

interface DB {
  users: User[]
  sessions: Record<string, string>
  customers: Record<string, Customer[]>
  deals: Record<string, Deal[]>
}

// In-memory database for serverless environment
const db: DB = { users: [], sessions: {}, customers: {}, deals: {} }

// Initialize with some sample data for demo purposes
if (db.users.length === 0) {
  // Add a demo user
  const demoUser: User = {
    id: randomUUID(),
    email: 'demo@example.com',
    passwordHash: '$2a$10$demo.hash.for.testing.purposes.only'
  }
  db.users.push(demoUser)
  
  // Add some sample customers for the demo user
  db.customers[demoUser.id] = [
    {
      id: randomUUID(),
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "+1 (555) 123-4567",
      company: "TechCorp Inc.",
      website: "techcorp.com",
      status: "active",
      value: 12000,
      lastContact: new Date().toISOString().split('T')[0],
      avatar: "/avatars/01.png"
    },
    {
      id: randomUUID(),
      name: "Michael Chen",
      email: "michael.chen@example.com",
      phone: "+1 (555) 234-5678",
      company: "Global Solutions",
      website: "globalsolutions.com",
      status: "pending",
      value: 8500,
      lastContact: new Date().toISOString().split('T')[0],
      avatar: "/avatars/02.png"
    },
    {
      id: randomUUID(),
      name: "Emily Davis",
      email: "emily.davis@example.com",
      phone: "+1 (555) 345-6789",
      company: "Innovation Labs",
      website: "innovationlabs.com",
      status: "active",
      value: 15200,
      lastContact: new Date().toISOString().split('T')[0],
      avatar: "/avatars/03.png"
    }
  ]
}

export function createUser(email: string, passwordHash: string) {
  if (db.users.find(u => u.email === email)) {
    throw new Error('User already exists')
  }
  const user: User = { id: randomUUID(), email, passwordHash }
  db.users.push(user)
  db.customers[user.id] = [] // Initialize empty customers array
  return user
}

export function findUserByEmail(email: string): User | undefined {
  return db.users.find(u => u.email === email)
}

export function findUserById(id: string): User | undefined {
  return db.users.find(u => u.id === id)
}

export function createSession(userId: string) {
  const token = randomUUID()
  db.sessions[token] = userId
  return token
}

export function getUserIdFromSession(token: string | undefined): string | undefined {
  if (!token) return undefined
  return db.sessions[token]
}

export function clearSession(token: string) {
  delete db.sessions[token]
}

export function getCustomers(userId: string): Customer[] {
  return db.customers[userId] ?? []
}

export function saveCustomers(userId: string, customers: Customer[]) {
  db.customers[userId] = customers
}

export function getDeals(userId: string): Deal[] {
  return db.deals[userId] ?? []
}

export function saveDeals(userId: string, deals: Deal[]) {
  db.deals[userId] = deals
}
