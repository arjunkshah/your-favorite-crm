export interface Customer {
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

export const customers: Customer[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@techcorp.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp Inc.",
    website: "techcorp.com",
    status: "active",
    value: 12000,
    lastContact: "2024-01-15",
    avatar: "/avatars/01.png"
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@globalsolutions.com",
    phone: "+1 (555) 234-5678",
    company: "Global Solutions",
    website: "globalsolutions.com",
    status: "pending",
    value: 8500,
    lastContact: "2024-01-10",
    avatar: "/avatars/02.png"
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.davis@innovationlabs.com",
    phone: "+1 (555) 345-6789",
    company: "Innovation Labs",
    website: "innovationlabs.com",
    status: "active",
    value: 15200,
    lastContact: "2024-01-12",
    avatar: "/avatars/03.png"
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david.wilson@futuresystems.com",
    phone: "+1 (555) 456-7890",
    company: "Future Systems",
    website: "futuresystems.com",
    status: "inactive",
    value: 6800,
    lastContact: "2024-01-05",
    avatar: "/avatars/04.png"
  }
]
