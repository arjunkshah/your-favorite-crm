import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromSession, getCustomers, saveCustomers } from '@/lib/db'
import { randomUUID } from 'crypto'

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
  
  const customers = getCustomers(userId)
  return NextResponse.json(customers, { headers: response.headers })
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
  const customers = getCustomers(userId)
  
  const newCustomer = {
    id: randomUUID(),
    name: data.name,
    email: data.email,
    phone: data.phone || '',
    company: data.company || '',
    website: data.website || '',
    status: data.status || 'pending',
    value: data.value || 0,
    lastContact: new Date().toISOString().split('T')[0],
    avatar: data.avatar || ''
  }
  
  customers.push(newCustomer)
  saveCustomers(userId, customers)
  
  return NextResponse.json(newCustomer, { headers: response.headers })
} 