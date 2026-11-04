import { NextResponse } from 'next/server'
import { MENU_BY_ID } from '@/lib/menu'
import { MAX_QTY_PER_ITEM, MAX_TABLE, MAX_TOTAL_ITEMS, createOrder, listOrders } from '@/lib/orders'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(listOrders())
}

function cleanName(value: unknown) {
  if (typeof value !== 'string') return null
  const v = value.trim().replace(/\s+/g, ' ')
  if (v.length < 1 || v.length > 40) return null
  if (!/^[\p{L}' -]+$/u.test(v)) return null
  return v
}

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 })
  }

  const firstName = cleanName(body.firstName)
  const lastName = cleanName(body.lastName)
  if (!firstName || !lastName) {
    return NextResponse.json({ error: 'Nombre y apellido no válidos.' }, { status: 400 })
  }

  const table = Number(body.table)
  if (!Number.isInteger(table) || table < 1 || table > MAX_TABLE) {
    return NextResponse.json({ error: `El número de mesa debe estar entre 1 y ${MAX_TABLE}.` }, { status: 400 })
  }

  const cardNumber = typeof body.cardNumber === 'string' ? body.cardNumber.replace(/\s/g, '') : ''
  if (!/^\d{16}$/.test(cardNumber)) {
    return NextResponse.json({ error: 'Número de tarjeta no válido.' }, { status: 400 })
  }
  if (cardNumber === '4000000000000002') {
    return NextResponse.json({ error: 'Pago rechazado por el banco emisor.' }, { status: 402 })
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: 'El pedido está vacío.' }, { status: 400 })
  }

  const merged = new Map<string, number>()
  for (const raw of body.items as unknown[]) {
    const line = raw as { productId?: unknown; quantity?: unknown }
    const productId = typeof line.productId === 'string' ? line.productId : ''
    const quantity = Number(line.quantity)
    if (!MENU_BY_ID.has(productId) || !Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json({ error: 'Producto o cantidad no válidos.' }, { status: 400 })
    }
    merged.set(productId, (merged.get(productId) ?? 0) + quantity)
  }

  let totalItems = 0
  for (const qty of merged.values()) {
    if (qty > MAX_QTY_PER_ITEM) {
      return NextResponse.json({ error: `Máximo ${MAX_QTY_PER_ITEM} unidades por producto.` }, { status: 400 })
    }
    totalItems += qty
  }
  if (totalItems > MAX_TOTAL_ITEMS) {
    return NextResponse.json({ error: `Máximo ${MAX_TOTAL_ITEMS} productos por pedido.` }, { status: 400 })
  }

  // Simulated gateway latency
  await new Promise((r) => setTimeout(r, 1200))

  const order = createOrder({
    firstName,
    lastName,
    table,
    lines: [...merged].map(([productId, quantity]) => ({ productId, quantity })),
    last4: cardNumber.slice(-4),
  })
  return NextResponse.json(order, { status: 201 })
}
