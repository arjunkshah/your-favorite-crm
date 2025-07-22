import { NextRequest, NextResponse } from 'next/server'

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

  return NextResponse.json({ 
    status: 'OK', 
    message: 'Vercel API is working!',
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  }, { headers: response.headers })
} 