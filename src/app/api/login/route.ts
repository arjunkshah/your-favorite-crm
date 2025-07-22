import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { findUserByEmail, createSession } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  }
  const user = findUserByEmail(email)
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  const token = createSession(user.id)
  const res = NextResponse.json({ id: user.id, email: user.email })
  res.cookies.set('session', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 })
  return res
}
