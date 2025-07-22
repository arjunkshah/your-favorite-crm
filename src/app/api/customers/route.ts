import { NextResponse } from 'next/server'
import { customers, Customer } from '@/data/customers'

export async function GET() {
  return NextResponse.json(customers)
}

export async function POST(request: Request) {
  const data: Partial<Customer> = await request.json()
  const newCustomer: Customer = {
    id: Date.now().toString(),
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    company: data.company || '',
    website: data.website || '',
    status: (data.status as Customer['status']) || 'active',
    value: 0,
    lastContact: new Date().toISOString().split('T')[0],
    avatar: data.avatar
  }
  customers.push(newCustomer)
  return NextResponse.json(newCustomer, { status: 201 })
}
