"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Filter,
  Eye,
  Share2,
  Clock
} from "lucide-react"

interface Report {
  id: string
  name: string
  type: 'sales' | 'customer' | 'performance' | 'financial'
  status: 'generated' | 'pending' | 'failed'
  createdAt: string
  lastUpdated: string
  data: Record<string, unknown>
}

interface ReportData {
  sales: {
    totalRevenue: number
    growth: number
    deals: number
    conversionRate: number
  }
  customers: {
    total: number
    new: number
    churn: number
    retention: number
  }
  performance: {
    avgDealSize: number
    salesCycle: number
    winRate: number
    responseTime: number
  }
  financial: {
    revenue: number
    expenses: number
    profit: number
    margin: number
  }
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [selectedReportType, setSelectedReportType] = useState<string>("all")
  const [reportData] = useState<ReportData>({
    sales: {
      totalRevenue: 45231,
      growth: 17.6,
      deals: 573,
      conversionRate: 72.3
    },
    customers: {
      total: 2350,
      new: 180,
      churn: 12,
      retention: 94.8
    },
    performance: {
      avgDealSize: 12500,
      salesCycle: 45,
      winRate: 68.5,
      responseTime: 2.3
    },
    financial: {
      revenue: 45231,
      expenses: 28450,
      profit: 16781,
      margin: 37.1
    }
  })

  // Initialize with sample reports
  useEffect(() => {
    const sampleReports: Report[] = [
      {
        id: "1",
        name: "Q4 Sales Report",
        type: "sales",
        status: "generated",
        createdAt: "2024-01-15T10:00:00",
        lastUpdated: "2024-01-20T14:30:00",
        data: {}
      },
      {
        id: "2",
        name: "Customer Retention Analysis",
        type: "customer",
        status: "generated",
        createdAt: "2024-01-18T09:00:00",
        lastUpdated: "2024-01-19T16:45:00",
        data: {}
      },
      {
        id: "3",
        name: "Performance Metrics Q4",
        type: "performance",
        status: "pending",
        createdAt: "2024-01-20T11:00:00",
        lastUpdated: "2024-01-20T11:00:00",
        data: {}
      },
      {
        id: "4",
        name: "Financial Summary 2024",
        type: "financial",
        status: "generated",
        createdAt: "2024-01-10T08:00:00",
        lastUpdated: "2024-01-15T12:00:00",
        data: {}
      }
    ]
    setReports(sampleReports)
  }, [])

  const filteredReports = reports.filter(report => 
    selectedReportType === "all" || report.type === selectedReportType
  )

  const generateReport = (type: string) => {
    const newReport: Report = {
      id: Date.now().toString(),
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${new Date().toLocaleDateString()}`,
      type: type as 'sales' | 'customer' | 'performance' | 'financial',
      status: "pending",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      data: {}
    }
    setReports([...reports, newReport])
  }

  const downloadReport = (reportId: string) => {
    // Simulate download
    console.log(`Downloading report ${reportId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "generated":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sales":
        return <DollarSign className="h-4 w-4" />
      case "customer":
        return <Users className="h-4 w-4" />
      case "performance":
        return <Target className="h-4 w-4" />
      case "financial":
        return <BarChart3 className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and manage business reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedReportType} onValueChange={setSelectedReportType}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="sales">Sales Reports</SelectItem>
              <SelectItem value="customer">Customer Reports</SelectItem>
              <SelectItem value="performance">Performance Reports</SelectItem>
              <SelectItem value="financial">Financial Reports</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">
              {reports.filter(r => r.status === 'generated').length} ready
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => new Date(r.createdAt).getMonth() === new Date().getMonth()).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Reports generated
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((reports.filter(r => r.status === 'generated').length / reports.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully generated
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Generate New Report
          </CardTitle>
          <CardDescription>
            Create custom reports for different business metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2"
              onClick={() => generateReport('sales')}
            >
              <DollarSign className="h-6 w-6" />
              <span>Sales Report</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2"
              onClick={() => generateReport('customer')}
            >
              <Users className="h-6 w-6" />
              <span>Customer Report</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2"
              onClick={() => generateReport('performance')}
            >
              <Target className="h-6 w-6" />
              <span>Performance Report</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2"
              onClick={() => generateReport('financial')}
            >
              <BarChart3 className="h-6 w-6" />
              <span>Financial Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Recent Reports
          </CardTitle>
          <CardDescription>
            View and manage your generated reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50 border">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(report.type)}
                    <div>
                      <div className="font-medium">{report.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Created: {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => downloadReport(report.id)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sales Metrics */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Sales Overview
            </CardTitle>
            <CardDescription>Key sales performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Revenue</span>
                <span className="text-sm font-bold">${reportData.sales.totalRevenue.toLocaleString()}</span>
              </div>
              <Progress value={reportData.sales.growth} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Growth: {reportData.sales.growth}%</span>
                <span>{reportData.sales.deals} deals</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Metrics */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Customer Metrics
            </CardTitle>
            <CardDescription>Customer acquisition and retention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Customers</span>
                <span className="text-sm font-bold">{reportData.customers.total.toLocaleString()}</span>
              </div>
              <Progress value={reportData.customers.retention} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Retention: {reportData.customers.retention}%</span>
                <span>+{reportData.customers.new} new</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Performance Metrics
          </CardTitle>
          <CardDescription>Sales and operational performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Average Deal Size</div>
              <div className="text-2xl font-bold">${reportData.performance.avgDealSize.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Per closed deal</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Sales Cycle</div>
              <div className="text-2xl font-bold">{reportData.performance.salesCycle} days</div>
              <div className="text-xs text-muted-foreground">Average time to close</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Win Rate</div>
              <div className="text-2xl font-bold">{reportData.performance.winRate}%</div>
              <div className="text-xs text-muted-foreground">Deals won vs total</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Response Time</div>
              <div className="text-2xl font-bold">{reportData.performance.responseTime}h</div>
              <div className="text-xs text-muted-foreground">Average response</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 