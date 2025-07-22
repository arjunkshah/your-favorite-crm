import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromSession, findUserById } from '@/lib/db'

export function GET(req: NextRequest) {
  const token = req.cookies.get('session')?.value
  const userId = getUserIdFromSession(token)
  if (!userId) return NextResponse.json({ user: null })
  const user = findUserById(userId)
  if (!user) return NextResponse.json({ user: null })
  return NextResponse.json({ user: { id: user.id, email: user.email } })
}
