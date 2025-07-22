"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Mail,
  Phone,
  Star,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Activity
} from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  website: string
  status: 'active' | 'pending' | 'inactive'
  value: number
  lastContact: string
  avatar?: string
}

export function DashboardContent() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('https://crm-qp4by219w-arjun-shahs-projects-cc47488b.vercel.app/api/customers', { credentials: 'include' })
        if (response.ok) {
          const data = await response.json()
          setCustomers(data)
        }
      } catch (error) {
        console.error('Failed to fetch customers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  // Calculate dashboard stats from real data
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.value, 0)
  const activeCustomers = customers.filter(c => c.status === 'active').length
  const pendingCustomers = customers.filter(c => c.status === 'pending').length
  const inactiveCustomers = customers.filter(c => c.status === 'inactive').length

  const recentCustomers = customers.slice(0, 4) // Show last 4 customers

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats with Claymorphic Styling */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="p-2 rounded-xl bg-primary/10 shadow-sm">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +{activeCustomers} active customers
              </span>
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <div className="p-2 rounded-xl bg-primary/10 shadow-sm">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +{activeCustomers} active
              </span>
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deals</CardTitle>
            <div className="p-2 rounded-xl bg-primary/10 shadow-sm">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCustomers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-yellow-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +{pendingCustomers} pending
              </span>
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <div className="p-2 rounded-xl bg-primary/10 shadow-sm">
              <Target className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveCustomers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                {inactiveCustomers} inactive
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Enhanced Claymorphic Styling */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Customers */}
        <Card className="col-span-4 shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10 shadow-sm">
                <Users className="h-4 w-4 text-primary" />
              </div>
              Recent Customers
            </CardTitle>
            <CardDescription>
              You have {customers.length} customers total.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCustomers.length > 0 ? (
                recentCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center space-x-4 p-3 rounded-xl bg-background/50 shadow-sm hover:shadow-md transition-shadow">
                    <Avatar className="shadow-sm">
                      <AvatarImage src={customer.avatar} alt={customer.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                      <p className="text-xs text-muted-foreground">{customer.company}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={customer.status === 'active' ? 'default' : customer.status === 'pending' ? 'secondary' : 'outline'} className="shadow-sm">
                        {customer.status}
                      </Badge>
                      <span className="text-sm font-medium">${customer.value.toLocaleString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No customers yet</p>
                  <p className="text-sm">Add your first customer to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sales Overview */}
        <Card className="col-span-3 shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10 shadow-sm">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              Customer Overview
            </CardTitle>
            <CardDescription>
              Customer status distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Active</span>
                  <span className="text-sm text-muted-foreground">{activeCustomers}</span>
                </div>
                <div className="p-2 rounded-xl bg-background/50 shadow-sm">
                  <Progress value={customers.length > 0 ? (activeCustomers / customers.length) * 100 : 0} className="h-2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pending</span>
                  <span className="text-sm text-muted-foreground">{pendingCustomers}</span>
                </div>
                <div className="p-2 rounded-xl bg-background/50 shadow-sm">
                  <Progress value={customers.length > 0 ? (pendingCustomers / customers.length) * 100 : 0} className="h-2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Inactive</span>
                  <span className="text-sm text-muted-foreground">{inactiveCustomers}</span>
                </div>
                <div className="p-2 rounded-xl bg-background/50 shadow-sm">
                  <Progress value={customers.length > 0 ? (inactiveCustomers / customers.length) * 100 : 0} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity with Claymorphic Styling */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 shadow-sm">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            Quick Actions
          </CardTitle>
          <CardDescription>
            Manage your customers and deals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button 
              className="h-auto p-4 flex-col space-y-2" 
              variant="outline"
              onClick={() => router.push('/customers')}
            >
              <Users className="h-6 w-6" />
              <span>Add Customer</span>
            </Button>
            <Button 
              className="h-auto p-4 flex-col space-y-2" 
              variant="outline"
              onClick={() => router.push('/deals')}
            >
              <DollarSign className="h-6 w-6" />
              <span>Create Deal</span>
            </Button>
            <Button 
              className="h-auto p-4 flex-col space-y-2" 
              variant="outline"
              onClick={() => router.push('/calendar')}
            >
              <Calendar className="h-6 w-6" />
              <span>Schedule Meeting</span>
            </Button>
            <Button 
              className="h-auto p-4 flex-col space-y-2" 
              variant="outline"
              onClick={() => router.push('/messages')}
            >
              <Mail className="h-6 w-6" />
              <span>Send Email</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 