import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromSession, getCustomers, saveCustomers } from '@/lib/db'

export async function PUT(req: NextRequest, context: any) {
  const { params } = context as { params: { id: string } }
  const token = req.cookies.get('session')?.value
  const userId = getUserIdFromSession(token)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const customers = getCustomers(userId)
  const index = customers.findIndex(c => c.id === params.id)
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  customers[index] = { ...customers[index], ...data }
  saveCustomers(userId, customers)
  return NextResponse.json(customers[index])
}

export async function DELETE(req: NextRequest, context: any) {
  const { params } = context as { params: { id: string } }
  const token = req.cookies.get('session')?.value
  const userId = getUserIdFromSession(token)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const customers = getCustomers(userId)
  const index = customers.findIndex(c => c.id === params.id)
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const [removed] = customers.splice(index, 1)
  saveCustomers(userId, customers)
  return NextResponse.json(removed)
}
