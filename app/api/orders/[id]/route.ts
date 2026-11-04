import { NextResponse } from 'next/server'
import { advanceOrder } from '@/lib/orders'

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = advanceOrder(id)
  if (!order) return NextResponse.json({ error: 'Pedido no encontrado.' }, { status: 404 })
  return NextResponse.json(order)
}
