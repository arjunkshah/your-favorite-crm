/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { customers, Customer } from '@/data/customers'

export async function PUT(request: Request, { params }: { params: any }) {
  const id = params.id
  const index = customers.findIndex(c => c.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  const data: Partial<Customer> = await request.json()
  customers[index] = { ...customers[index], ...data }
  return NextResponse.json(customers[index])
}

export async function DELETE(request: Request, { params }: { params: any }) {
  const id = params.id
  const index = customers.findIndex(c => c.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  const removed = customers.splice(index, 1)[0]
  return NextResponse.json(removed)
}
