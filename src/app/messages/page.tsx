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
  Edit, 
  Trash2, 
  Reply,
  Forward,
  Archive,
  Star,
  Clock,
  User,
  Phone,
  Building
} from "lucide-react"

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
  attachments?: string[]
}

interface Conversation {
  id: string
  customer: string
  customerEmail: string
  customerCompany: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  status: 'active' | 'archived' | 'pending'
  avatar?: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [isComposing, setIsComposing] = useState(false)

  // Initialize with sample data
  useEffect(() => {
    const sampleMessages: Message[] = [
      {
        id: "1",
        from: "Sarah Johnson",
        to: "sales@company.com",
        subject: "Product Inquiry - TechCorp",
        content: "Hi, I'm interested in learning more about your enterprise solution. Could you provide more details about pricing and features?",
        timestamp: "2024-01-20T10:30:00",
        status: "unread",
        priority: "high",
        category: "inquiry"
      },
      {
        id: "2",
        from: "Michael Chen",
        to: "support@company.com",
        subject: "Technical Support Request",
        content: "We're experiencing issues with the API integration. Can you help us troubleshoot this?",
        timestamp: "2024-01-20T09:15:00",
        status: "read",
        priority: "medium",
        category: "support"
      },
      {
        id: "3",
        from: "Emily Davis",
        to: "sales@company.com",
        subject: "Contract Renewal Discussion",
        content: "We'd like to discuss renewing our contract and potentially expanding our usage.",
        timestamp: "2024-01-19T16:45:00",
        status: "read",
        priority: "high",
        category: "sales"
      }
    ]

    const sampleConversations: Conversation[] = [
      {
        id: "1",
        customer: "Sarah Johnson",
        customerEmail: "sarah.johnson@techcorp.com",
        customerCompany: "TechCorp Inc.",
        lastMessage: "Product Inquiry - TechCorp",
        lastMessageTime: "2024-01-20T10:30:00",
        unreadCount: 1,
        status: "active",
        avatar: "/avatars/01.png"
      },
      {
        id: "2",
        customer: "Michael Chen",
        customerEmail: "michael.chen@globalsolutions.com",
        customerCompany: "Global Solutions",
        lastMessage: "Technical Support Request",
        lastMessageTime: "2024-01-20T09:15:00",
        unreadCount: 0,
        status: "active",
        avatar: "/avatars/02.png"
      },
      {
        id: "3",
        customer: "Emily Davis",
        customerEmail: "emily.davis@innovationlabs.com",
        customerCompany: "Innovation Labs",
        lastMessage: "Contract Renewal Discussion",
        lastMessageTime: "2024-01-19T16:45:00",
        unreadCount: 0,
        status: "active",
        avatar: "/avatars/03.png"
      }
    ]

    setMessages(sampleMessages)
    setConversations(sampleConversations)
  }, [])

  const filteredConversations = conversations.filter(conversation =>
    conversation.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.customerCompany.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedConversationData = conversations.find(c => c.id === selectedConversation)
  const conversationMessages = messages.filter(m => 
    m.from === selectedConversationData?.customer || m.to === selectedConversationData?.customer
  )

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: Date.now().toString(),
      from: "sales@company.com",
      to: selectedConversationData?.customerEmail || "",
      subject: "Re: " + (conversationMessages[0]?.subject || "Message"),
      content: newMessage,
      timestamp: new Date().toISOString(),
      status: "sent",
      priority: "medium",
      category: "general"
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const markAsRead = (messageId: string) => {
    setMessages(messages.map(m => 
      m.id === messageId ? { ...m, status: "read" } : m
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
            <div className="text-2xl font-bold">{messages.length}</div>
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
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              Avg response time: 2.3h
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.filter(m => m.priority === 'high').length}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
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
              <Button size="sm" onClick={() => setIsComposing(true)}>
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
            <div className="space-y-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation === conversation.id
                      ? "bg-primary/10 border-primary"
                      : "bg-background/50 hover:bg-background/70"
                  } border`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={conversation.avatar} alt={conversation.customer} />
                      <AvatarFallback>{conversation.customer.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="font-medium truncate">{conversation.customer}</div>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="default" className="text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {conversation.customerCompany}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              {selectedConversationData ? selectedConversationData.customer : "Select a conversation"}
            </CardTitle>
            {selectedConversationData && (
              <CardDescription>
                {selectedConversationData.customerCompany} • {selectedConversationData.customerEmail}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {selectedConversationData ? (
              <div className="space-y-4">
                {/* Messages */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {conversationMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg ${
                        message.from === selectedConversationData.customer
                          ? "bg-background/50 ml-4"
                          : "bg-primary/10 mr-4"
                      }`}
                      onClick={() => markAsRead(message.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon(message.status)}
                            <span className="font-medium">{message.subject}</span>
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
                  ))}
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

      {/* Message Categories */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Message Categories
          </CardTitle>
          <CardDescription>
            Overview of message types and priorities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Inquiries</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {messages.filter(m => m.category === 'inquiry').length}
              </div>
              <div className="text-sm text-muted-foreground">Product questions</div>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4 text-green-600" />
                <span className="font-medium">Support</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {messages.filter(m => m.category === 'support').length}
              </div>
              <div className="text-sm text-muted-foreground">Technical issues</div>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950">
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Sales</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {messages.filter(m => m.category === 'sales').length}
              </div>
              <div className="text-sm text-muted-foreground">Business opportunities</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-950">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-gray-600" />
                <span className="font-medium">General</span>
              </div>
              <div className="text-2xl font-bold text-gray-600">
                {messages.filter(m => m.category === 'general').length}
              </div>
              <div className="text-sm text-muted-foreground">Other messages</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 