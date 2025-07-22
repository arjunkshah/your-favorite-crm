import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromSession, getDeals, saveDeals } from '@/lib/db'

type Props = {
  params: Promise<{ id: string }>
}

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
  const deals = getDeals(userId)
  const index = deals.findIndex(d => d.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { 
      status: 404,
      headers: response.headers
    })
  }
  
  deals[index] = { 
    ...deals[index], 
    ...data, 
    updatedAt: new Date().toISOString() 
  }
  saveDeals(userId, deals)
  return NextResponse.json(deals[index], { headers: response.headers })
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
  
  const deals = getDeals(userId)
  const filteredDeals = deals.filter(d => d.id !== id)
  if (filteredDeals.length === deals.length) {
    return NextResponse.json({ error: 'Not found' }, { 
      status: 404,
      headers: response.headers
    })
  }
  
  saveDeals(userId, filteredDeals)
  return NextResponse.json({ success: true }, { headers: response.headers })
} 