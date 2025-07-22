"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target,
  Calendar,
  Activity,
  ArrowUpRight,
  ArrowDownRight
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

interface AnalyticsData {
  totalRevenue: number
  totalCustomers: number
  activeCustomers: number
  pendingCustomers: number
  inactiveCustomers: number
  averageDealSize: number
  conversionRate: number
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customers')
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

  // Calculate real analytics from customer data
  const analytics: AnalyticsData = {
    totalRevenue: customers.reduce((sum, customer) => sum + customer.value, 0),
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    pendingCustomers: customers.filter(c => c.status === 'pending').length,
    inactiveCustomers: customers.filter(c => c.status === 'inactive').length,
    averageDealSize: customers.length > 0 ? customers.reduce((sum, c) => sum + c.value, 0) / customers.length : 0,
    conversionRate: customers.length > 0 ? (customers.filter(c => c.status === 'active').length / customers.length) * 100 : 0
  }

  // Get recent customers (last 6 for trend)
  const recentCustomers = customers.slice(-6)

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (customers.length === 0) {
    return (
      <div className="p-6 space-y-6 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track your business performance and insights</p>
          </div>
        </div>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Add some customers to start seeing analytics and insights about your business performance.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your business performance and insights</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
              From {analytics.totalCustomers} customers
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.activeCustomers} active, {analytics.pendingCustomers} pending
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Deal Size</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(analytics.averageDealSize).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Per customer value
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Active customer rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Status Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Customer Distribution
            </CardTitle>
            <CardDescription>Breakdown by customer status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div>
                    <div className="text-sm font-medium">Active</div>
                    <div className="text-xs text-muted-foreground">
                      {analytics.activeCustomers} customers
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium">
                  {analytics.totalCustomers > 0 ? ((analytics.activeCustomers / analytics.totalCustomers) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <Progress 
                value={analytics.totalCustomers > 0 ? (analytics.activeCustomers / analytics.totalCustomers) * 100 : 0} 
                className="h-2"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div>
                    <div className="text-sm font-medium">Pending</div>
                    <div className="text-xs text-muted-foreground">
                      {analytics.pendingCustomers} customers
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium">
                  {analytics.totalCustomers > 0 ? ((analytics.pendingCustomers / analytics.totalCustomers) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <Progress 
                value={analytics.totalCustomers > 0 ? (analytics.pendingCustomers / analytics.totalCustomers) * 100 : 0} 
                className="h-2"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div>
                    <div className="text-sm font-medium">Inactive</div>
                    <div className="text-xs text-muted-foreground">
                      {analytics.inactiveCustomers} customers
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium">
                  {analytics.totalCustomers > 0 ? ((analytics.inactiveCustomers / analytics.totalCustomers) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <Progress 
                value={analytics.totalCustomers > 0 ? (analytics.inactiveCustomers / analytics.totalCustomers) * 100 : 0} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Revenue Insights
            </CardTitle>
            <CardDescription>Revenue breakdown and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Total Revenue</div>
                <div className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">From all customers</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Active Customer Revenue</div>
                <div className="text-xl font-bold">
                  ${customers.filter(c => c.status === 'active').reduce((sum, c) => sum + c.value, 0).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">From active customers only</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Average Deal Size</div>
                <div className="text-xl font-bold">${Math.round(analytics.averageDealSize).toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Per customer</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Customers */}
      {recentCustomers.length > 0 && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Customers
            </CardTitle>
            <CardDescription>Latest customers added to your system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {customer.company}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${customer.value.toLocaleString()}</div>
                    <div className={`text-sm ${
                      customer.status === 'active' ? 'text-green-600' : 
                      customer.status === 'pending' ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {customer.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}