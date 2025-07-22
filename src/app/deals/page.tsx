"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Target,
  TrendingUp,
  Calendar,
  Building,
  Users
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

interface Deal {
  id: string
  title: string
  description: string
  value: number
  status: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost'
  priority: 'low' | 'medium' | 'high'
  customerId: string
  customerName: string
  customerCompany: string
  expectedCloseDate: string
  createdAt: string
  updatedAt: string
  assignedTo: string
  source: string
  tags: string[]
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [loading, setLoading] = useState(true)
  const [newDeal, setNewDeal] = useState({
    title: "",
    description: "",
    value: 0,
    status: "prospecting" as const,
    priority: "medium" as const,
    customerId: "",
    customerName: "",
    customerCompany: "",
    expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    source: "website",
    tags: [] as string[]
  })

  // Load deals and customers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dealsRes, customersRes] = await Promise.all([
          fetch("/api/deals", { credentials: "include" }),
          fetch("/api/customers", { credentials: "include" })
        ])
        
        if (dealsRes.ok) {
          const dealsData = await dealsRes.json()
          setDeals(dealsData)
        }
        
        if (customersRes.ok) {
          const customersData = await customersRes.json()
          setCustomers(customersData)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.customerCompany.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || deal.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const addDeal = async () => {
    try {
      const selectedCustomer = customers.find(c => c.id === newDeal.customerId)
      const dealData = {
        ...newDeal,
        customerName: selectedCustomer?.name || '',
        customerCompany: selectedCustomer?.company || ''
      }

      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(dealData)
      })
      
      if (res.ok) {
        const deal: Deal = await res.json()
        setDeals([...deals, deal])
        setNewDeal({
          title: "",
          description: "",
          value: 0,
          status: "prospecting",
          priority: "medium",
          customerId: "",
          customerName: "",
          customerCompany: "",
          expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          source: "website",
          tags: []
        })
        setIsAddDialogOpen(false)
      }
    } catch (error) {
      console.error('Failed to add deal:', error)
    }
  }

  const updateDeal = async () => {
    if (!editingDeal) return
    
    try {
      const res = await fetch(`/api/deals/${editingDeal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editingDeal)
      })
      
      if (res.ok) {
        const updated: Deal = await res.json()
        setDeals(deals.map(d => d.id === updated.id ? updated : d))
        setEditingDeal(null)
      }
    } catch (error) {
      console.error('Failed to update deal:', error)
    }
  }

  const deleteDeal = async (id: string) => {
    try {
      const res = await fetch(`/api/deals/${id}`, {
        method: "DELETE",
        credentials: "include"
      })
      
      if (res.ok) {
        setDeals(deals.filter(d => d.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete deal:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "prospecting":
        return "bg-blue-100 text-blue-800"
      case "qualification":
        return "bg-yellow-100 text-yellow-800"
      case "proposal":
        return "bg-orange-100 text-orange-800"
      case "negotiation":
        return "bg-purple-100 text-purple-800"
      case "closed-won":
        return "bg-green-100 text-green-800"
      case "closed-lost":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalValue = deals.reduce((sum, d) => sum + d.value, 0)
  const wonDeals = deals.filter(d => d.status === 'closed-won').length
  const activeDeals = deals.filter(d => !['closed-won', 'closed-lost'].includes(d.status)).length

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deal Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across {deals.length} deals
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeals}</div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Won Deals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wonDeals}</div>
            <p className="text-xs text-muted-foreground">
              Successfully closed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Deal Management
              </CardTitle>
              <CardDescription>
                Track and manage your sales opportunities
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Deal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Deal</DialogTitle>
                  <DialogDescription>
                    Create a new deal opportunity.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Title</Label>
                    <Input
                      id="title"
                      value={newDeal.title}
                      onChange={(e) => setNewDeal({...newDeal, title: e.target.value})}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Textarea
                      id="description"
                      value={newDeal.description}
                      onChange={(e) => setNewDeal({...newDeal, description: e.target.value})}
                      className="col-span-3"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="value" className="text-right">Value ($)</Label>
                    <Input
                      id="value"
                      type="number"
                      value={newDeal.value}
                      onChange={(e) => setNewDeal({...newDeal, value: parseFloat(e.target.value) || 0})}
                      className="col-span-3"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customer" className="text-right">Customer</Label>
                    <Select value={newDeal.customerId} onValueChange={(value) => setNewDeal({...newDeal, customerId: value})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map(customer => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} - {customer.company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">Status</Label>
                    <Select value={newDeal.status} onValueChange={(value) => setNewDeal({...newDeal, status: value as any})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prospecting">Prospecting</SelectItem>
                        <SelectItem value="qualification">Qualification</SelectItem>
                        <SelectItem value="proposal">Proposal</SelectItem>
                        <SelectItem value="negotiation">Negotiation</SelectItem>
                        <SelectItem value="closed-won">Closed Won</SelectItem>
                        <SelectItem value="closed-lost">Closed Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="priority" className="text-right">Priority</Label>
                    <Select value={newDeal.priority} onValueChange={(value) => setNewDeal({...newDeal, priority: value as any})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="expectedCloseDate" className="text-right">Expected Close</Label>
                    <Input
                      id="expectedCloseDate"
                      type="date"
                      value={newDeal.expectedCloseDate}
                      onChange={(e) => setNewDeal({...newDeal, expectedCloseDate: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={addDeal} disabled={!newDeal.title || !newDeal.customerId}>
                    Add Deal
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="prospecting">Prospecting</SelectItem>
                <SelectItem value="qualification">Qualification</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="closed-won">Closed Won</SelectItem>
                <SelectItem value="closed-lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredDeals.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No deals found</h3>
              <p className="text-muted-foreground mb-4">
                {deals.length === 0 
                  ? "Create your first deal to start tracking opportunities." 
                  : "Try adjusting your search or filters."}
              </p>
              {deals.length === 0 && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Deal
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deal</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Expected Close</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeals.map((deal) => (
                    <TableRow key={deal.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{deal.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {deal.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{deal.customerName}</div>
                            <div className="text-sm text-muted-foreground">{deal.customerCompany}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${deal.value.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(deal.status)}>
                          {deal.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(deal.priority)}>
                          {deal.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(deal.expectedCloseDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => setEditingDeal(deal)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteDeal(deal.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Deal Dialog */}
      <Dialog open={!!editingDeal} onOpenChange={() => setEditingDeal(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
            <DialogDescription>
              Update the deal information.
            </DialogDescription>
          </DialogHeader>
          {editingDeal && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">Title</Label>
                <Input
                  id="edit-title"
                  value={editingDeal.title}
                  onChange={(e) => setEditingDeal({...editingDeal, title: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-value" className="text-right">Value ($)</Label>
                <Input
                  id="edit-value"
                  type="number"
                  value={editingDeal.value}
                  onChange={(e) => setEditingDeal({...editingDeal, value: parseFloat(e.target.value) || 0})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">Status</Label>
                <Select value={editingDeal.status} onValueChange={(value) => setEditingDeal({...editingDeal, status: value as any})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prospecting">Prospecting</SelectItem>
                    <SelectItem value="qualification">Qualification</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="closed-won">Closed Won</SelectItem>
                    <SelectItem value="closed-lost">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-priority" className="text-right">Priority</Label>
                <Select value={editingDeal.priority} onValueChange={(value) => setEditingDeal({...editingDeal, priority: value as any})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingDeal(null)}>Cancel</Button>
            <Button onClick={updateDeal}>Update Deal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 