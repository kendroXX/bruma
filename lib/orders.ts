import { MENU_BY_ID } from './menu'

export type OrderStatus = 'nuevo' | 'preparacion' | 'listo' | 'entregado'

export type OrderItem = {
  productId: string
  name: string
  quantity: number
  unitPrice: number
}

export type Order = {
  id: string
  firstName: string
  lastName: string
  table: number
  items: OrderItem[]
  total: number
  status: OrderStatus
  payment: { verified: boolean; transactionId: string; last4: string; paidAt: string }
  createdAt: string
}

export const STATUS_FLOW: Record<OrderStatus, OrderStatus | null> = {
  nuevo: 'preparacion',
  preparacion: 'listo',
  listo: 'entregado',
  entregado: null,
}

export const MAX_QTY_PER_ITEM = 10
export const MAX_TOTAL_ITEMS = 30
export const MAX_TABLE = 50

type Store = { orders: Order[]; seq: number }

// In-memory store kept on globalThis so it survives hot reloads. Data resets when the server restarts.
const globalStore = globalThis as unknown as { __cafeStore?: Store }

function makeId(seq: number) {
  return `A-${String(seq).padStart(3, '0')}`
}

function txId() {
  return `TX${Math.random().toString(36).slice(2, 10).toUpperCase()}`
}

function buildItems(lines: { productId: string; quantity: number }[]): OrderItem[] {
  return lines.map(({ productId, quantity }) => {
    const product = MENU_BY_ID.get(productId)!
    return { productId, name: product.name, quantity, unitPrice: product.price }
  })
}

function sumItems(items: OrderItem[]) {
  return Math.round(items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0) * 100) / 100
}

function seed(): Store {
  const now = Date.now()
  const samples: Array<[string, string, number, OrderStatus, { productId: string; quantity: number }[], number]> = [
    ['Lucía', 'Fernández', 4, 'nuevo', [{ productId: 'latte-canela', quantity: 2 }, { productId: 'croissant-almendra', quantity: 2 }], 3],
    ['Mateo', 'García', 9, 'preparacion', [{ productId: 'tostada-aguacate', quantity: 1 }, { productId: 'cold-brew-naranja', quantity: 1 }], 9],
    ['Valentina', 'Ruiz', 2, 'listo', [{ productId: 'tarta-vasca', quantity: 1 }, { productId: 'chai-especiado', quantity: 1 }], 15],
  ]
  const orders = samples.map(([firstName, lastName, table, status, lines, minutesAgo], idx) => {
    const items = buildItems(lines)
    const at = new Date(now - minutesAgo * 60_000).toISOString()
    return {
      id: makeId(idx + 1),
      firstName,
      lastName,
      table,
      items,
      total: sumItems(items),
      status,
      payment: { verified: true, transactionId: txId(), last4: '4242', paidAt: at },
      createdAt: at,
    } satisfies Order
  })
  return { orders, seq: orders.length }
}

function store(): Store {
  if (!globalStore.__cafeStore) globalStore.__cafeStore = seed()
  return globalStore.__cafeStore
}

export function listOrders() {
  return store().orders.filter((o) => o.status !== 'entregado')
}

export function createOrder(input: {
  firstName: string
  lastName: string
  table: number
  lines: { productId: string; quantity: number }[]
  last4: string
}) {
  const s = store()
  s.seq += 1
  const items = buildItems(input.lines)
  const now = new Date().toISOString()
  const order: Order = {
    id: makeId(s.seq),
    firstName: input.firstName,
    lastName: input.lastName,
    table: input.table,
    items,
    total: sumItems(items),
    status: 'nuevo',
    payment: { verified: true, transactionId: txId(), last4: input.last4, paidAt: now },
    createdAt: now,
  }
  s.orders.unshift(order)
  return order
}

export function advanceOrder(id: string) {
  const order = store().orders.find((o) => o.id === id)
  if (!order) return null
  const next = STATUS_FLOW[order.status]
  if (next) order.status = next
  return order
}
