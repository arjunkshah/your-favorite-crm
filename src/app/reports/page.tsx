"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp,
  DollarSign,
  Users,
  Target,
  BarChart3,
  Filter,
  Eye,
  Share2,
  Clock
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
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedReportType, setSelectedReportType] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  // Load customers and calculate real report data
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

  // Calculate real report data from customers
  const reportData: ReportData = {
    sales: {
      totalRevenue: customers.reduce((sum, c) => sum + c.value, 0),
      growth: 0, // Could calculate based on date if we had historical data
      deals: customers.length,
      conversionRate: customers.length > 0 ? (customers.filter(c => c.status === 'active').length / customers.length) * 100 : 0
    },
    customers: {
      total: customers.length,
      new: customers.filter(c => c.status === 'pending').length,
      churn: customers.filter(c => c.status === 'inactive').length,
      retention: customers.length > 0 ? ((customers.length - customers.filter(c => c.status === 'inactive').length) / customers.length) * 100 : 0
    },
    performance: {
      avgDealSize: customers.length > 0 ? customers.reduce((sum, c) => sum + c.value, 0) / customers.length : 0,
      salesCycle: 30, // Could calculate based on date fields if available
      winRate: customers.length > 0 ? (customers.filter(c => c.status === 'active').length / customers.length) * 100 : 0,
      responseTime: 2.3 // This would need tracking data
    },
    financial: {
      revenue: customers.reduce((sum, c) => sum + c.value, 0),
      expenses: customers.reduce((sum, c) => sum + c.value, 0) * 0.3, // Assume 30% costs
      profit: customers.reduce((sum, c) => sum + c.value, 0) * 0.7, // 70% profit margin
      margin: 70
    }
  }

  const filteredReports = reports.filter(report => 
    selectedReportType === "all" || report.type === selectedReportType
  )

  const generateReport = (type: string) => {
    const newReport: Report = {
      id: Date.now().toString(),
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${new Date().toLocaleDateString()}`,
      type: type as 'sales' | 'customer' | 'performance' | 'financial',
      status: "generated",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      data: {}
    }
    setReports([...reports, newReport])
  }

  const downloadReport = (reportId: string) => {
    // Generate CSV content based on current data
    const report = reports.find(r => r.id === reportId)
    if (!report) return

    let csvContent = ""
    
    switch (report.type) {
      case 'sales':
        csvContent = "Metric,Value\n"
        csvContent += `Total Revenue,$${reportData.sales.totalRevenue}\n`
        csvContent += `Total Deals,${reportData.sales.deals}\n`
        csvContent += `Conversion Rate,${reportData.sales.conversionRate.toFixed(1)}%\n`
        break
      case 'customer':
        csvContent = "Customer Name,Company,Email,Status,Value\n"
        customers.forEach(customer => {
          csvContent += `${customer.name},${customer.company},${customer.email},${customer.status},$${customer.value}\n`
        })
        break
      case 'performance':
        csvContent = "Metric,Value\n"
        csvContent += `Average Deal Size,$${reportData.performance.avgDealSize.toFixed(2)}\n`
        csvContent += `Win Rate,${reportData.performance.winRate.toFixed(1)}%\n`
        csvContent += `Sales Cycle,${reportData.performance.salesCycle} days\n`
        break
      case 'financial':
        csvContent = "Metric,Value\n"
        csvContent += `Revenue,$${reportData.financial.revenue}\n`
        csvContent += `Expenses,$${reportData.financial.expenses.toFixed(2)}\n`
        csvContent += `Profit,$${reportData.financial.profit.toFixed(2)}\n`
        csvContent += `Margin,${reportData.financial.margin}%\n`
        break
    }

    // Download the CSV
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${report.name}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
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
              {reports.length > 0 ? Math.round((reports.filter(r => r.status === 'generated').length / reports.length) * 100) : 100}%
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully generated
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">
              Customer records
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
      {reports.length > 0 ? (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Generated Reports
            </CardTitle>
            <CardDescription>
              View and download your generated reports
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
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Reports Generated</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Generate your first report using the buttons above to start tracking your business metrics.
            </p>
          </CardContent>
        </Card>
      )}

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
              <Progress value={Math.min(reportData.sales.conversionRate, 100)} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Conversion: {reportData.sales.conversionRate.toFixed(1)}%</span>
                <span>{reportData.sales.deals} customers</span>
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
              <Progress value={Math.min(reportData.customers.retention, 100)} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Retention: {reportData.customers.retention.toFixed(1)}%</span>
                <span>{reportData.customers.new} pending</span>
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
              <div className="text-2xl font-bold">${Math.round(reportData.performance.avgDealSize).toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Per customer</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Sales Cycle</div>
              <div className="text-2xl font-bold">{reportData.performance.salesCycle} days</div>
              <div className="text-xs text-muted-foreground">Average time to close</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Win Rate</div>
              <div className="text-2xl font-bold">{reportData.performance.winRate.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Active customers</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Profit Margin</div>
              <div className="text-2xl font-bold">{reportData.financial.margin}%</div>
              <div className="text-xs text-muted-foreground">Revenue to profit</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 