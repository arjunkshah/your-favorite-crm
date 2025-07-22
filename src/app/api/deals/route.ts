import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromSession, getDeals, saveDeals } from '@/lib/db'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('session')?.value
  const userId = getUserIdFromSession(token)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const deals = getDeals(userId)
  return NextResponse.json(deals)
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('session')?.value
  const userId = getUserIdFromSession(token)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const data = await req.json()
  const deals = getDeals(userId)
  
  const newDeal = {
    id: Date.now().toString(),
    title: data.title,
    description: data.description || '',
    value: data.value || 0,
    status: data.status || 'prospecting',
    priority: data.priority || 'medium',
    customerId: data.customerId || '',
    customerName: data.customerName || '',
    customerCompany: data.customerCompany || '',
    expectedCloseDate: data.expectedCloseDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignedTo: userId,
    source: data.source || 'website',
    tags: data.tags || []
  }
  
  deals.push(newDeal)
  saveDeals(userId, deals)
  
  return NextResponse.json(newDeal)
} 