"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Mail, 
  Phone,
  Building,
  Globe,
  Calendar
} from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  website: string
  status: 'active' | 'inactive' | 'pending'
  value: number
  lastContact: string
  avatar?: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    status: "active" as 'active' | 'pending' | 'inactive',
    value: 0
  })

  // Load customers from the backend
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("https://crm-qp4by219w-arjun-shahs-projects-cc47488b.vercel.app/api/customers", {
          credentials: "include"
        })
        if (res.ok) {
          const data = await res.json()
          setCustomers(data)
        }
      } catch (error) {
        console.error('Failed to load customers:', error)
      }
    }
    load()
  }, [])

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const addCustomer = async () => {
    try {
      const res = await fetch("https://crm-qp4by219w-arjun-shahs-projects-cc47488b.vercel.app/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newCustomer)
      })
      if (res.ok) {
        const customer: Customer = await res.json()
        setCustomers([...customers, customer])
        setNewCustomer({
          name: "",
          email: "",
          phone: "",
          company: "",
          website: "",
          status: "active",
          value: 0
        })
        setIsAddDialogOpen(false)
      }
    } catch (error) {
      console.error('Failed to add customer:', error)
    }
  }

  const updateCustomer = async () => {
    if (!editingCustomer) return
    try {
      const res = await fetch(`https://crm-qp4by219w-arjun-shahs-projects-cc47488b.vercel.app/api/customers/${editingCustomer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editingCustomer)
      })
      if (res.ok) {
        const updated: Customer = await res.json()
        setCustomers(customers.map(c => c.id === updated.id ? updated : c))
        setEditingCustomer(null)
      }
    } catch (error) {
      console.error('Failed to update customer:', error)
    }
  }

  const deleteCustomer = async (id: string) => {
    try {
      const res = await fetch(`https://crm-qp4by219w-arjun-shahs-projects-cc47488b.vercel.app/api/customers/${id}`, {
        method: "DELETE",
        credentials: "include"
      })
      if (res.ok) {
        setCustomers(customers.filter(c => c.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete customer:', error)
    }
  }

  const totalValue = customers.reduce((sum, c) => sum + c.value, 0)
  const activeCustomers = customers.filter(c => c.status === 'active').length

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">
              +{activeCustomers} active customers
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Average: ${customers.length > 0 ? Math.round(totalValue / customers.length).toLocaleString() : 0}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length > 0 ? Math.round((activeCustomers / customers.length) * 100) : 0}%</div>
            <p className="text-xs text-muted-foreground">
              {activeCustomers} of {customers.length} customers
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
                <Users className="h-5 w-5 text-primary" />
                Customer Management
              </CardTitle>
              <CardDescription>
                Manage your customer relationships and data
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                  <DialogDescription>
                    Enter the customer information below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input
                      id="name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">Phone</Label>
                    <Input
                      id="phone"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="company" className="text-right">Company</Label>
                    <Input
                      id="company"
                      value={newCustomer.company}
                      onChange={(e) => setNewCustomer({...newCustomer, company: e.target.value})}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="website" className="text-right">Website</Label>
                    <Input
                      id="website"
                      value={newCustomer.website}
                      onChange={(e) => setNewCustomer({...newCustomer, website: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="value" className="text-right">Value ($)</Label>
                    <Input
                      id="value"
                      type="number"
                      value={newCustomer.value}
                      onChange={(e) => setNewCustomer({...newCustomer, value: parseFloat(e.target.value) || 0})}
                      className="col-span-3"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">Status</Label>
                    <Select value={newCustomer.status} onValueChange={(value: 'active' | 'pending' | 'inactive') => setNewCustomer({...newCustomer, status: value})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={addCustomer} disabled={!newCustomer.name || !newCustomer.email || !newCustomer.company}>
                    Add Customer
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
                placeholder="Search customers..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No customers found</h3>
              <p className="text-muted-foreground mb-4">
                {customers.length === 0 
                  ? "Add your first customer to get started with your CRM." 
                  : "Try adjusting your search or filters."}
              </p>
              {customers.length === 0 && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Customer
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Last Contact</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={customer.avatar} alt={customer.name} />
                            <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">{customer.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span>{customer.company}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{customer.phone || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={customer.status === 'active' ? 'default' : customer.status === 'pending' ? 'secondary' : 'outline'}>
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${customer.value.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">{customer.lastContact}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => setEditingCustomer(customer)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteCustomer(customer.id)}>
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

      {/* Edit Customer Dialog */}
      <Dialog open={!!editingCustomer} onOpenChange={() => setEditingCustomer(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update the customer information below.
            </DialogDescription>
          </DialogHeader>
          {editingCustomer && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Name</Label>
                <Input
                  id="edit-name"
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({...editingCustomer, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingCustomer.email}
                  onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editingCustomer.phone}
                  onChange={(e) => setEditingCustomer({...editingCustomer, phone: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-company" className="text-right">Company</Label>
                <Input
                  id="edit-company"
                  value={editingCustomer.company}
                  onChange={(e) => setEditingCustomer({...editingCustomer, company: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-website" className="text-right">Website</Label>
                <Input
                  id="edit-website"
                  value={editingCustomer.website}
                  onChange={(e) => setEditingCustomer({...editingCustomer, website: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-value" className="text-right">Value ($)</Label>
                <Input
                  id="edit-value"
                  type="number"
                  value={editingCustomer.value}
                  onChange={(e) => setEditingCustomer({...editingCustomer, value: parseFloat(e.target.value) || 0})}
                  className="col-span-3"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">Status</Label>
                <Select value={editingCustomer.status} onValueChange={(value: 'active' | 'pending' | 'inactive') => setEditingCustomer({...editingCustomer, status: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCustomer(null)}>Cancel</Button>
            <Button onClick={updateCustomer}>Update Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 