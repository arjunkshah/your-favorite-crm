import { NextRequest, NextResponse } from 'next/server'
import { clearSession, getUserIdFromSession } from '@/lib/db'

export function POST(req: NextRequest) {
  const token = req.cookies.get('session')?.value
  if (token) clearSession(token)
  const res = NextResponse.json({ ok: true })
  res.cookies.set('session', '', { httpOnly: true, path: '/', maxAge: 0 })
  return res
}
