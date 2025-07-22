"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { 
  Mail, 
  Search, 
  Send, 
  Plus, 
  Reply,
  Forward,
  Star,
  Clock,
  User,
  Phone,
  Building
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

interface Message {
  id: string
  from: string
  to: string
  subject: string
  content: string
  timestamp: string
  status: 'read' | 'unread' | 'sent' | 'draft'
  priority: 'low' | 'medium' | 'high'
  category: 'inquiry' | 'support' | 'sales' | 'general'
  customerId: string
}

interface Conversation {
  id: string
  customer: Customer
  messages: Message[]
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  status: 'active' | 'archived' | 'pending'
}

export default function MessagesPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)

  // Load customers and create conversations
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('https://crm-qp4by219w-arjun-shahs-projects-cc47488b.vercel.app/api/customers', { credentials: 'include' })
        if (response.ok) {
          const customerData = await response.json()
          setCustomers(customerData)
          
          // Create conversations from customers
          const customerConversations: Conversation[] = customerData.map((customer: Customer) => ({
            id: customer.id,
            customer,
            messages: [], // Start with empty messages
            lastMessage: "Start a conversation",
            lastMessageTime: new Date().toISOString(),
            unreadCount: 0,
            status: 'active' as const
          }))
          
          setConversations(customerConversations)
        }
      } catch (error) {
        console.error('Failed to fetch customers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const filteredConversations = conversations.filter(conversation =>
    conversation.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedConversationData = conversations.find(c => c.id === selectedConversation)

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !selectedConversationData) return

    const message: Message = {
      id: Date.now().toString(),
      from: "You",
      to: selectedConversationData.customer.email,
      subject: "Message from CRM",
      content: newMessage,
      timestamp: new Date().toISOString(),
      status: "sent",
      priority: "medium",
      category: "general",
      customerId: selectedConversation
    }

    // Update conversation with new message
    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          lastMessage: newMessage,
          lastMessageTime: new Date().toISOString()
        }
      }
      return conv
    })

    setConversations(updatedConversations)
    setNewMessage("")
  }

  const addNewMessage = (customerId: string, content: string, from: string) => {
    const message: Message = {
      id: Date.now().toString(),
      from,
      to: from === "You" ? customers.find(c => c.id === customerId)?.email || "" : "You",
      subject: "Customer Inquiry",
      content,
      timestamp: new Date().toISOString(),
      status: from === "You" ? "sent" : "unread",
      priority: "medium",
      category: "inquiry",
      customerId
    }

    const updatedConversations = conversations.map(conv => {
      if (conv.id === customerId) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          lastMessage: content,
          lastMessageTime: new Date().toISOString(),
          unreadCount: from === "You" ? conv.unreadCount : conv.unreadCount + 1
        }
      }
      return conv
    })

    setConversations(updatedConversations)
  }

  const markAsRead = (conversationId: string) => {
    setConversations(conversations.map(conv => 
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ))
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "unread":
        return <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
      case "read":
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
      case "sent":
        return <div className="w-2 h-2 bg-green-600 rounded-full"></div>
      default:
        return null
    }
  }

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0)
  const totalMessages = conversations.reduce((sum, c) => sum + c.messages.length, 0)

  // Add some sample messages to demonstrate functionality
  useEffect(() => {
    if (conversations.length > 0 && conversations[0].messages.length === 0) {
      // Add a welcome message to the first conversation as an example
      setTimeout(() => {
        if (conversations[0]) {
          addNewMessage(
            conversations[0].id, 
            "Hi! I'm interested in learning more about your services. Could you provide more information about pricing and features?",
            conversations[0].customer.name
          )
        }
      }, 1000)
    }
  }, [conversations.length])

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
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              {totalUnread} unread messages
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversations.filter(c => c.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              {conversations.filter(c => c.status === 'archived').length} archived
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conversations.length > 0 ? Math.round((conversations.filter(c => c.messages.length > 0).length / conversations.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Conversations with replies
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">
              Total customer contacts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Messages Interface */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Conversations List */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Conversations
              </CardTitle>
              <Button 
                size="sm" 
                onClick={() => {
                  if (customers.length > 0) {
                    addNewMessage(
                      customers[0].id, 
                      "New conversation started",
                      "You"
                    )
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredConversations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No conversations found</p>
                <p className="text-sm">Add customers to start conversations</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation === conversation.id
                        ? "bg-primary/10 border-primary"
                        : "bg-background/50 hover:bg-background/70"
                    } border`}
                    onClick={() => {
                      setSelectedConversation(conversation.id)
                      markAsRead(conversation.id)
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={conversation.customer.avatar} alt={conversation.customer.name} />
                        <AvatarFallback>{conversation.customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="font-medium truncate">{conversation.customer.name}</div>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="default" className="text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {conversation.customer.company}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              {selectedConversationData ? selectedConversationData.customer.name : "Select a conversation"}
            </CardTitle>
            {selectedConversationData && (
              <CardDescription>
                {selectedConversationData.customer.company} • {selectedConversationData.customer.email}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {selectedConversationData ? (
              <div className="space-y-4">
                {/* Messages */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {selectedConversationData.messages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No messages yet</p>
                      <p className="text-sm">Start the conversation below</p>
                    </div>
                  ) : (
                    selectedConversationData.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg ${
                          message.from === "You"
                            ? "bg-primary/10 mr-4"
                            : "bg-background/50 ml-4"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getStatusIcon(message.status)}
                              <span className="font-medium">{message.from}</span>
                              <Badge className={getPriorityColor(message.priority)}>
                                {message.priority}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              {new Date(message.timestamp).toLocaleString()}
                            </div>
                            <div className="text-sm">{message.content}</div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Reply className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Forward className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Reply Box */}
                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                      rows={3}
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to view messages</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Customer Status Distribution */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Customer Communication Status
          </CardTitle>
          <CardDescription>
            Message activity by customer status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-green-600" />
                <span className="font-medium">Active Customers</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {customers.filter(c => c.status === 'active').length}
              </div>
              <div className="text-sm text-muted-foreground">Regular communication</div>
            </div>
            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4 text-yellow-600" />
                <span className="font-medium">Pending Customers</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {customers.filter(c => c.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Awaiting response</div>
            </div>
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950">
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-4 w-4 text-red-600" />
                <span className="font-medium">Inactive Customers</span>
              </div>
              <div className="text-2xl font-bold text-red-600">
                {customers.filter(c => c.status === 'inactive').length}
              </div>
              <div className="text-sm text-muted-foreground">Need follow-up</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 