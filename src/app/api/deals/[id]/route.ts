import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromSession, getDeals, saveDeals } from '@/lib/db'

type Props = {
  params: Promise<{ id: string }>
}

export async function PUT(req: NextRequest, { params }: Props) {
  const { id } = await params
  const token = req.cookies.get('session')?.value
  const userId = getUserIdFromSession(token)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const data = await req.json()
  const deals = getDeals(userId)
  const index = deals.findIndex(d => d.id === id)
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  
  deals[index] = { 
    ...deals[index], 
    ...data, 
    updatedAt: new Date().toISOString() 
  }
  saveDeals(userId, deals)
  return NextResponse.json(deals[index])
}

export async function DELETE(req: NextRequest, { params }: Props) {
  const { id } = await params
  const token = req.cookies.get('session')?.value
  const userId = getUserIdFromSession(token)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const deals = getDeals(userId)
  const filteredDeals = deals.filter(d => d.id !== id)
  if (filteredDeals.length === deals.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  
  saveDeals(userId, filteredDeals)
  return NextResponse.json({ success: true })
} 