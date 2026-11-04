'use client'

import useSWR from 'swr'
import { ArrowRight, BadgeCheck, Clock, Coffee } from 'lucide-react'
import { formatPrice } from '@/lib/menu'
import type { Order, OrderStatus } from '@/lib/orders'

const fetcher = (url: string) => fetch(url).then((r) => r.json() as Promise<Order[]>)

const COLUMNS: { status: OrderStatus; title: string; action: string }[] = [
  { status: 'nuevo', title: 'Nuevos pedidos (pagados)', action: 'Iniciar preparación' },
  { status: 'preparacion', title: 'En preparación', action: 'Marcar como listo' },
  { status: 'listo', title: 'Listos para entregar', action: 'Entregado' },
]

function minutesAgo(iso: string) {
  const m = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000))
  return m === 0 ? 'Ahora' : `Hace ${m} min`
}

export function OrdersBoard() {
  const { data: orders = [], mutate, isLoading } = useSWR('/api/orders', fetcher, { refreshInterval: 3000 })

  async function advance(order: Order) {
    const idx = COLUMNS.findIndex((c) => c.status === order.status)
    const nextStatus: OrderStatus = COLUMNS[idx + 1]?.status ?? 'entregado'
    await mutate(
      async (current = []) => {
        await fetch(`/api/orders/${order.id}`, { method: 'PATCH' })
        return current
          .map((o) => (o.id === order.id ? { ...o, status: nextStatus } : o))
          .filter((o) => o.status !== 'entregado')
      },
      {
        optimisticData: (current = []) =>
          current
            .map((o) => (o.id === order.id ? { ...o, status: nextStatus } : o))
            .filter((o) => o.status !== 'entregado'),
        revalidate: true,
      },
    )
  }

  const totalToday = orders.reduce((a, o) => a + o.total, 0)

  return (
    <div className="flex min-h-dvh flex-col bg-secondary/50">
      <header className="border-b bg-background">
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Coffee className="size-4" aria-hidden="true" />
            </span>
            <div className="flex flex-col">
              <h1 className="font-serif text-xl font-semibold leading-tight">Caja · Almendra</h1>
              <p className="text-xs text-muted-foreground">Panel de pedidos en tiempo real</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              En vivo
            </span>
            <span>
              <span className="text-muted-foreground">Activos: </span>
              <strong>{orders.length}</strong>
            </span>
            <span>
              <span className="text-muted-foreground">Importe en curso: </span>
              <strong>{formatPrice(totalToday)}</strong>
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto p-5 md:p-8">
        <div className="grid min-w-[56rem] grid-cols-3 gap-5">
          {COLUMNS.map((col) => {
            const items = orders.filter((o) => o.status === col.status)
            return (
              <section key={col.status} aria-labelledby={`col-${col.status}`} className="flex flex-col gap-4 rounded-3xl bg-background p-4">
                <div className="flex items-center justify-between px-1">
                  <h2 id={`col-${col.status}`} className="font-serif text-lg font-semibold">
                    {col.title}
                  </h2>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-sm font-semibold">{items.length}</span>
                </div>

                {isLoading ? (
                  <div className="h-40 animate-pulse rounded-2xl bg-secondary" />
                ) : items.length === 0 ? (
                  <p className="rounded-2xl border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
                    Sin pedidos aquí
                  </p>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {items.map((order) => (
                      <li key={order.id}>
                        <OrderCard order={order} actionLabel={col.action} onAdvance={() => advance(order)} />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )
          })}
        </div>
      </main>
    </div>
  )
}

function OrderCard({ order, actionLabel, onAdvance }: { order: Order; actionLabel: string; onAdvance: () => void }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border bg-popover p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h3 className="font-semibold">
            {order.firstName} {order.lastName}
          </h3>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-mono">{order.id}</span>·
            <Clock className="size-3" aria-hidden="true" />
            {minutesAgo(order.createdAt)}
          </p>
        </div>
        <div className="flex flex-col items-center rounded-xl bg-primary px-3 py-1.5 text-primary-foreground">
          <span className="text-[10px] tracking-widest uppercase opacity-70">Mesa</span>
          <span className="font-serif text-xl leading-none font-semibold">{order.table}</span>
        </div>
      </div>

      <ul className="flex flex-col gap-1.5 border-y py-3 text-sm">
        {order.items.map((item) => (
          <li key={item.productId} className="flex justify-between gap-2">
            <span>
              <strong className="font-semibold">{item.quantity}×</strong> {item.name}
            </span>
            <span className="text-muted-foreground">{formatPrice(item.quantity * item.unitPrice)}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-2">
        {order.payment.verified ? (
          <span className="flex items-center gap-1.5 rounded-full bg-accent/20 px-2.5 py-1 text-xs font-medium">
            <BadgeCheck className="size-3.5" aria-hidden="true" />
            Pago verificado · {order.payment.last4}
          </span>
        ) : (
          <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">Pendiente</span>
        )}
        <span className="font-serif text-lg font-semibold">{formatPrice(order.total)}</span>
      </div>

      <button
        type="button"
        onClick={onAdvance}
        className="flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-px"
      >
        {actionLabel}
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </article>
  )
}
