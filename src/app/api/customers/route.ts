import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromSession, getCustomers, saveCustomers } from '@/lib/db'
import { randomUUID } from 'crypto'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('session')?.value
  const userId = getUserIdFromSession(token)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(getCustomers(userId))
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('session')?.value
  const userId = getUserIdFromSession(token)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const customers = getCustomers(userId)
  const customer = {
    id: randomUUID(),
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    website: data.website,
    status: data.status ?? 'active',
    value: data.value ?? 0,
    lastContact: new Date().toISOString().split('T')[0],
    avatar: data.avatar,
  }
  customers.push(customer)
  saveCustomers(userId, customers)
  return NextResponse.json(customer)
}
