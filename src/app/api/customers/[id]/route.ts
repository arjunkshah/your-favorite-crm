import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromSession, getCustomers, saveCustomers } from '@/lib/db'

type Props = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Props) {
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

  const { id } = await params
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
  const index = customers.findIndex(c => c.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { 
      status: 404,
      headers: response.headers
    })
  }
  
  customers[index] = { ...customers[index], ...data }
  saveCustomers(userId, customers)
  return NextResponse.json(customers[index], { headers: response.headers })
}

export async function DELETE(req: NextRequest, { params }: Props) {
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

  const { id } = await params
  const token = req.cookies.get('session')?.value
  const userId = getUserIdFromSession(token)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { 
      status: 401,
      headers: response.headers
    })
  }
  
  const customers = getCustomers(userId)
  const filteredCustomers = customers.filter(c => c.id !== id)
  if (filteredCustomers.length === customers.length) {
    return NextResponse.json({ error: 'Not found' }, { 
      status: 404,
      headers: response.headers
    })
  }
  
  saveCustomers(userId, filteredCustomers)
  return NextResponse.json({ success: true }, { headers: response.headers })
} 