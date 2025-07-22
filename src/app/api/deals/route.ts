import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromSession, getDeals, saveDeals } from '@/lib/db'

export async function GET(req: NextRequest) {
  // Add CORS headers
  const response = NextResponse.next()
  response.headers.set('Access-Control-Allow-Origin', 'https://yourfavcrm.surge.sh')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers })
  }

  const token = req.cookies.get('session')?.value
  const userId = getUserIdFromSession(token)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { 
      status: 401,
      headers: response.headers
    })
  }
  
  const deals = getDeals(userId)
  return NextResponse.json(deals, { headers: response.headers })
}

export async function POST(req: NextRequest) {
  // Add CORS headers
  const response = NextResponse.next()
  response.headers.set('Access-Control-Allow-Origin', 'https://yourfavcrm.surge.sh')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers })
  }

  const token = req.cookies.get('session')?.value
  const userId = getUserIdFromSession(token)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { 
      status: 401,
      headers: response.headers
    })
  }
  
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
  
  return NextResponse.json(newDeal, { headers: response.headers })
} 