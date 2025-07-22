import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail, createUser, createSession } from '@/lib/db'
import bcrypt from 'bcryptjs'

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

  try {
    const { email, password } = await req.json()
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { 
        status: 400,
        headers: response.headers
      })
    }
    
    const existingUser = findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { 
        status: 409,
        headers: response.headers
      })
    }
    
    const passwordHash = await bcrypt.hash(password, 10)
    const user = createUser(email, passwordHash)
    
    const token = createSession(user.id)
    const res = NextResponse.json({ success: true }, { headers: response.headers })
    res.cookies.set('session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    return res
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { 
      status: 500,
      headers: response.headers
    })
  }
} 