import { NextRequest, NextResponse } from 'next/server'
import { clearSession } from '@/lib/db'

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
  if (token) {
    clearSession(token)
  }
  
  const res = NextResponse.json({ success: true }, { headers: response.headers })
  res.cookies.set('session', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 0
  })
  
  return res
} 