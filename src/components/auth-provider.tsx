"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { DashboardLayout } from './dashboard-layout'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/me')
        if (res.ok) {
          setIsAuthenticated(true)
          // If authenticated and on auth pages, redirect to dashboard
          if (pathname === '/login' || pathname === '/register' || pathname === '/') {
            router.push('/dashboard')
          }
        } else {
          setIsAuthenticated(false)
          // Redirect to login if not on auth pages and not authenticated
          if (!pathname.includes('/login') && !pathname.includes('/register')) {
            router.push('/login')
          }
        }
      } catch (error) {
        setIsAuthenticated(false)
        if (!pathname.includes('/login') && !pathname.includes('/register')) {
          router.push('/login')
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If not authenticated and not on auth pages, redirect will happen
  if (!isAuthenticated && !pathname.includes('/login') && !pathname.includes('/register')) {
    return null
  }

  // If authenticated and on protected routes, show dashboard layout
  if (isAuthenticated && !pathname.includes('/login') && !pathname.includes('/register')) {
    return <DashboardLayout>{children}</DashboardLayout>
  }

  // If on auth pages, show without dashboard layout
  return <>{children}</>
} 