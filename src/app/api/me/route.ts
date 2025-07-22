import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromSession, findUserById } from '@/lib/db'

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
  
  const user = findUserById(userId)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { 
      status: 404,
      headers: response.headers
    })
  }
  
  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.email.split('@')[0], // Use email prefix as name
    phone: '',
    company: '',
    role: 'User'
  }, { headers: response.headers })
} 