"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

export function DashboardContent() {
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
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +20.1%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <div className="p-2 rounded-xl bg-primary/10 shadow-sm">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +180.1%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <div className="p-2 rounded-xl bg-primary/10 shadow-sm">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +19%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <div className="p-2 rounded-xl bg-primary/10 shadow-sm">
              <Target className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                -4.3%
              </span>
              from last month
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
              You have 265 customers this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Sarah Johnson",
                  email: "sarah.johnson@example.com",
                  company: "TechCorp Inc.",
                  value: "$12,000",
                  status: "active",
                  avatar: "/avatars/01.png"
                },
                {
                  name: "Michael Chen",
                  email: "michael.chen@example.com",
                  company: "Global Solutions",
                  value: "$8,500",
                  status: "pending",
                  avatar: "/avatars/02.png"
                },
                {
                  name: "Emily Davis",
                  email: "emily.davis@example.com",
                  company: "Innovation Labs",
                  value: "$15,200",
                  status: "active",
                  avatar: "/avatars/03.png"
                },
                {
                  name: "David Wilson",
                  email: "david.wilson@example.com",
                  company: "Future Systems",
                  value: "$6,800",
                  status: "inactive",
                  avatar: "/avatars/04.png"
                }
              ].map((customer, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-xl bg-background/50 shadow-sm hover:shadow-md transition-shadow">
                  <Avatar className="shadow-sm">
                    <AvatarImage src={customer.avatar} alt={customer.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
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
                    <span className="text-sm font-medium">{customer.value}</span>
                  </div>
                </div>
              ))}
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
              Sales Overview
            </CardTitle>
            <CardDescription>
              Monthly sales performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">This Month</span>
                  <span className="text-sm text-muted-foreground">$45,231</span>
                </div>
                <div className="p-2 rounded-xl bg-background/50 shadow-sm">
                  <Progress value={75} className="h-2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Month</span>
                  <span className="text-sm text-muted-foreground">$38,450</span>
                </div>
                <div className="p-2 rounded-xl bg-background/50 shadow-sm">
                  <Progress value={60} className="h-2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Target</span>
                  <span className="text-sm text-muted-foreground">$50,000</span>
                </div>
                <div className="p-2 rounded-xl bg-background/50 shadow-sm">
                  <Progress value={90} className="h-2" />
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
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest customer interactions and deals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                type: "deal",
                title: "New deal created",
                description: "Sarah Johnson - TechCorp Inc. deal worth $12,000",
                time: "2 hours ago",
                icon: DollarSign
              },
              {
                type: "call",
                title: "Call scheduled",
                description: "Follow-up call with Michael Chen",
                time: "4 hours ago",
                icon: Phone
              },
              {
                type: "email",
                title: "Email sent",
                description: "Proposal sent to Emily Davis",
                time: "6 hours ago",
                icon: Mail
              },
              {
                type: "meeting",
                title: "Meeting completed",
                description: "Quarterly review with David Wilson",
                time: "1 day ago",
                icon: Calendar
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-3 rounded-xl bg-background/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 shadow-sm">
                  <activity.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 