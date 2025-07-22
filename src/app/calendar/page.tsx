"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Textarea } from "@/components/ui/textarea"
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  Users, 
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle
} from "lucide-react"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  duration: number
  type: 'meeting' | 'call' | 'demo' | 'follow-up'
  status: 'scheduled' | 'completed' | 'cancelled'
  attendees: string[]
  location?: string
  notes?: string
}

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    time: "09:00",
    duration: 60,
    type: "meeting" as 'meeting' | 'call' | 'demo' | 'follow-up',
    attendees: [] as string[],
    location: "",
    notes: ""
  })

  // Initialize with sample events
  useEffect(() => {
    const sampleEvents: Event[] = [
      {
        id: "1",
        title: "Product Demo - TechCorp",
        description: "Demonstrate new features to TechCorp team",
        date: "2024-01-20",
        time: "10:00",
        duration: 90,
        type: "demo",
        status: "scheduled",
        attendees: ["Sarah Johnson", "TechCorp Team"],
        location: "Conference Room A",
        notes: "Prepare demo environment and slides"
      },
      {
        id: "2",
        title: "Follow-up Call - Global Solutions",
        description: "Discuss proposal feedback and next steps",
        date: "2024-01-20",
        time: "14:00",
        duration: 45,
        type: "call",
        status: "scheduled",
        attendees: ["Michael Chen"],
        notes: "Review proposal changes"
      },
      {
        id: "3",
        title: "Quarterly Review - Innovation Labs",
        description: "Quarterly business review meeting",
        date: "2024-01-21",
        time: "11:00",
        duration: 120,
        type: "meeting",
        status: "scheduled",
        attendees: ["Emily Davis", "Innovation Labs Executives"],
        location: "Virtual Meeting",
        notes: "Prepare Q4 performance report"
      }
    ]
    setEvents(sampleEvents)
  }, [])

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date)
  }

  const addEvent = () => {
    const event: Event = {
      id: Date.now().toString(),
      ...newEvent,
      status: "scheduled"
    }
    setEvents([...events, event])
    setNewEvent({
      title: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
      time: "09:00",
      duration: 60,
      type: "meeting",
      attendees: [],
      location: "",
      notes: ""
    })
    setIsAddDialogOpen(false)
  }

  const updateEvent = () => {
    if (!editingEvent) return
    setEvents(events.map(e => e.id === editingEvent.id ? editingEvent : e))
    setEditingEvent(null)
  }

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id))
  }

  const markEventComplete = (id: string) => {
    setEvents(events.map(e => e.id === id ? { ...e, status: "completed" } : e))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-blue-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800"
      case "call":
        return "bg-green-100 text-green-800"
      case "demo":
        return "bg-purple-100 text-purple-800"
      case "follow-up":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const todayEvents = getEventsForDate(today)
  const upcomingEvents = events.filter(e => e.date >= today && e.status === "scheduled").slice(0, 5)

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">Manage your meetings and appointments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>
                Schedule a new meeting or appointment.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">Duration</Label>
                                     <Select value={newEvent.duration.toString()} onValueChange={(value: string) => setNewEvent({...newEvent, duration: parseInt(value)})}>
                       <SelectTrigger className="col-span-3">
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="30">30 minutes</SelectItem>
                         <SelectItem value="45">45 minutes</SelectItem>
                         <SelectItem value="60">1 hour</SelectItem>
                         <SelectItem value="90">1.5 hours</SelectItem>
                         <SelectItem value="120">2 hours</SelectItem>
                       </SelectContent>
                     </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                                 <Select value={newEvent.type} onValueChange={(value: 'meeting' | 'call' | 'demo' | 'follow-up') => setNewEvent({...newEvent, type: value})}>
                   <SelectTrigger className="col-span-3">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="meeting">Meeting</SelectItem>
                     <SelectItem value="call">Call</SelectItem>
                     <SelectItem value="demo">Demo</SelectItem>
                     <SelectItem value="follow-up">Follow-up</SelectItem>
                   </SelectContent>
                 </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">Location</Label>
                <Input
                  id="location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={addEvent}>Add Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Today's Events */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Today&apos;s Events
            </CardTitle>
            <CardDescription>
              {todayEvents.length} events scheduled for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No events scheduled for today
                </p>
              ) : (
                todayEvents.map((event) => (
                  <div key={event.id} className="p-3 rounded-lg bg-background/50 border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(event.status)}
                          <span className="font-medium">{event.title}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {event.time} • {event.duration} min
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{event.attendees.length} attendees</span>
                          {event.location && (
                            <>
                              <MapPin className="h-3 w-3" />
                              <span>{event.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge className={getTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                        {event.status === "scheduled" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markEventComplete(event.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Upcoming Events
            </CardTitle>
            <CardDescription>
              Next 5 scheduled events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-3 rounded-lg bg-background/50 border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium mb-1">{event.title}</div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {new Date(event.date).toLocaleDateString()} • {event.time}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {event.description}
                      </div>
                    </div>
                    <Badge className={getTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common calendar actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Schedule Call
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Schedule Demo
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Events Table */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            All Events
          </CardTitle>
          <CardDescription>
            Manage all your scheduled events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50 border">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(event.status)}
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleDateString()} • {event.time} • {event.duration} min
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getTypeColor(event.type)}>
                    {event.type}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => setEditingEvent(event)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteEvent(event.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 