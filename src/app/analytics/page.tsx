"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target,
  Calendar,
  Activity,
  PieChart,
  LineChart,
  BarChart,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

interface AnalyticsData {
  revenue: {
    current: number
    previous: number
    growth: number
  }
  customers: {
    total: number
    new: number
    churn: number
  }
  deals: {
    total: number
    won: number
    lost: number
    pipeline: number
  }
  performance: {
    conversionRate: number
    avgDealSize: number
    salesCycle: number
  }
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    revenue: {
      current: 45231,
      previous: 38450,
      growth: 17.6
    },
    customers: {
      total: 2350,
      new: 180,
      churn: 12
    },
    deals: {
      total: 573,
      won: 89,
      lost: 34,
      pipeline: 450
    },
    performance: {
      conversionRate: 72.3,
      avgDealSize: 12500,
      salesCycle: 45
    }
  })

  const monthlyData = [
    { month: "Jan", revenue: 42000, customers: 2100, deals: 520 },
    { month: "Feb", revenue: 38450, customers: 2180, deals: 480 },
    { month: "Mar", revenue: 45231, customers: 2350, deals: 573 },
    { month: "Apr", revenue: 48900, customers: 2420, deals: 610 },
    { month: "May", revenue: 52100, customers: 2480, deals: 645 },
    { month: "Jun", revenue: 48750, customers: 2510, deals: 598 }
  ]

  const dealStages = [
    { stage: "Prospecting", count: 120, value: 1800000, color: "bg-blue-500" },
    { stage: "Qualification", count: 85, value: 1275000, color: "bg-yellow-500" },
    { stage: "Proposal", count: 65, value: 975000, color: "bg-orange-500" },
    { stage: "Negotiation", count: 45, value: 675000, color: "bg-red-500" },
    { stage: "Closed Won", count: 89, value: 1335000, color: "bg-green-500" }
  ]

  const topPerformers = [
    { name: "Sarah Johnson", deals: 12, revenue: 145000, growth: 23 },
    { name: "Michael Chen", deals: 9, revenue: 118000, growth: 18 },
    { name: "Emily Davis", deals: 11, revenue: 132000, growth: 15 },
    { name: "David Wilson", deals: 8, revenue: 96000, growth: 12 }
  ]

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
            <div className="text-2xl font-bold">${analyticsData.revenue.current.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {analyticsData.revenue.growth > 0 ? (
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-1 text-red-600" />
              )}
              {Math.abs(analyticsData.revenue.growth)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.customers.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{analyticsData.customers.new} new, -{analyticsData.customers.churn} churned
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deal Pipeline</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.deals.pipeline.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.deals.won} won, {analyticsData.deals.lost} lost
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.performance.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Avg deal size: ${analyticsData.performance.avgDealSize.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Trend */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Revenue Trend
            </CardTitle>
            <CardDescription>Monthly revenue performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium">{data.month}</div>
                    <div className="flex-1">
                      <Progress 
                        value={(data.revenue / 60000) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                  <div className="text-sm font-medium">${data.revenue.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Deal Pipeline */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Deal Pipeline
            </CardTitle>
            <CardDescription>Current deals by stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dealStages.map((stage) => (
                <div key={stage.stage} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                    <div>
                      <div className="text-sm font-medium">{stage.stage}</div>
                      <div className="text-xs text-muted-foreground">
                        {stage.count} deals
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    ${(stage.value / 1000).toFixed(0)}k
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Performance Metrics
          </CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-sm font-medium">Conversion Rate</div>
              <div className="text-2xl font-bold">{analyticsData.performance.conversionRate}%</div>
              <Progress value={analyticsData.performance.conversionRate} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Average Deal Size</div>
              <div className="text-2xl font-bold">${analyticsData.performance.avgDealSize.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Per closed deal</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Sales Cycle</div>
              <div className="text-2xl font-bold">{analyticsData.performance.salesCycle} days</div>
              <div className="text-xs text-muted-foreground">Average time to close</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Top Performers
          </CardTitle>
          <CardDescription>Best performing sales representatives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={performer.name} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{performer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {performer.deals} deals closed
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${performer.revenue.toLocaleString()}</div>
                  <div className="text-sm text-green-600">+{performer.growth}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 