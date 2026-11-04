'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CheckCircle2, CreditCard, Loader2, Lock, Minus, Plus } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCart } from './cart-context'
import { formatPrice } from '@/lib/menu'
import { MAX_TABLE, type Order } from '@/lib/orders'

type Stage = 'cart' | 'processing' | 'success'

function formatCard(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatExpiry(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

export function CartSheet() {
  const { lines, total, isOpen, setOpen, setQuantity, clear } = useCart()
  const [stage, setStage] = useState<Stage>('cart')
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<Order | null>(null)
  const [card, setCard] = useState('')
  const [expiry, setExpiry] = useState('')

  function handleOpenChange(open: boolean) {
    if (stage === 'processing') return
    setOpen(open)
    if (!open && stage === 'success') {
      setStage('cart')
      setOrder(null)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)
    setStage('processing')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.get('firstName'),
          lastName: form.get('lastName'),
          table: Number(form.get('table')),
          cardNumber: card,
          items: lines.map((l) => ({ productId: l.product.id, quantity: l.quantity })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'No se pudo procesar el pago.')
      setOrder(data)
      setStage('success')
      clear()
      setCard('')
      setExpiry('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo procesar el pago.')
      setStage('cart')
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full gap-0 bg-background p-0 sm:max-w-md">
        {stage === 'success' && order ? (
          <SuccessView order={order} onClose={() => handleOpenChange(false)} />
        ) : (
          <>
            <SheetHeader className="border-b p-6">
              <SheetTitle className="font-serif text-2xl font-semibold">Tu pedido</SheetTitle>
              <SheetDescription>Revisa tus platos y completa el pago desde tu mesa.</SheetDescription>
            </SheetHeader>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                <p className="font-serif text-xl">Tu pedido está vacío</p>
                <p className="text-sm text-muted-foreground">Añade algo del menú para empezar.</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
                >
                  Ver el menú
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
                <ul className="flex flex-col gap-4 p-6">
                  {lines.map(({ product, quantity }) => (
                    <li key={product.id} className="flex items-center gap-4">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                        <Image src={product.image} alt="" fill sizes="64px" className="object-cover" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="truncate font-medium">{product.name}</span>
                        <span className="text-sm text-muted-foreground">{formatPrice(product.price)}</span>
                      </div>
                      <div className="flex items-center gap-1 rounded-full border p-0.5">
                        <button
                          type="button"
                          onClick={() => setQuantity(product.id, quantity - 1)}
                          className="flex size-7 items-center justify-center rounded-full hover:bg-secondary"
                          aria-label={`Quitar un ${product.name}`}
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-5 text-center text-sm font-semibold">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(product.id, quantity + 1)}
                          className="flex size-7 items-center justify-center rounded-full hover:bg-secondary"
                          aria-label={`Añadir un ${product.name}`}
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between border-y bg-secondary/60 px-6 py-4">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-serif text-2xl font-semibold">{formatPrice(total)}</span>
                </div>

                <fieldset className="flex flex-col gap-4 p-6" disabled={stage === 'processing'}>
                  <legend className="mb-4 text-sm font-semibold">Tus datos</legend>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input id="firstName" name="firstName" required maxLength={40} autoComplete="given-name" className="h-11 bg-popover" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input id="lastName" name="lastName" required maxLength={40} autoComplete="family-name" className="h-11 bg-popover" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="table">Número de mesa</Label>
                    <Input id="table" name="table" type="number" inputMode="numeric" min={1} max={MAX_TABLE} required className="h-11 bg-popover" />
                  </div>

                  <div className="mt-2 flex flex-col gap-3 rounded-2xl bg-card p-4 text-card-foreground">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <CreditCard className="size-4" aria-hidden="true" /> Pago con tarjeta
                      </span>
                      <span className="flex items-center gap-1 text-xs text-card-foreground/70">
                        <Lock className="size-3" aria-hidden="true" /> Pasarela simulada
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="card" className="text-card-foreground/80">Número de tarjeta</Label>
                      <Input
                        id="card"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        placeholder="4242 4242 4242 4242"
                        required
                        pattern="(\d{4} ){3}\d{4}"
                        title="Introduce 16 dígitos"
                        value={card}
                        onChange={(e) => setCard(formatCard(e.target.value))}
                        className="h-11 border-card-foreground/20 bg-card-foreground/10 text-card-foreground placeholder:text-card-foreground/40"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="expiry" className="text-card-foreground/80">Caducidad</Label>
                        <Input
                          id="expiry"
                          inputMode="numeric"
                          autoComplete="cc-exp"
                          placeholder="MM/AA"
                          required
                          pattern="(0[1-9]|1[0-2])/\d{2}"
                          title="Formato MM/AA"
                          value={expiry}
                          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                          className="h-11 border-card-foreground/20 bg-card-foreground/10 text-card-foreground placeholder:text-card-foreground/40"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="cvc" className="text-card-foreground/80">CVC</Label>
                        <Input
                          id="cvc"
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          placeholder="123"
                          required
                          pattern="\d{3,4}"
                          maxLength={4}
                          className="h-11 border-card-foreground/20 bg-card-foreground/10 text-card-foreground placeholder:text-card-foreground/40"
                        />
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-card-foreground/60">
                      Demo: usa cualquier tarjeta de 16 dígitos. 4000 0000 0000 0002 simula un rechazo.
                    </p>
                  </div>

                  {error && (
                    <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-px disabled:opacity-70"
                  >
                    {stage === 'processing' ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Procesando pago…
                      </>
                    ) : (
                      <>Pagar pedido · {formatPrice(total)}</>
                    )}
                  </button>
                </fieldset>
              </form>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function SuccessView({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 p-8 text-center">
      <CheckCircle2 className="size-14 text-accent" aria-hidden="true" />
      <SheetTitle className="font-serif text-3xl font-semibold text-balance">¡Pago aprobado, {order.firstName}!</SheetTitle>
      <SheetDescription className="leading-relaxed">
        Tu pedido <strong className="text-foreground">{order.id}</strong> ya está en cocina. Te lo llevamos a la
        mesa {order.table}.
      </SheetDescription>
      <dl className="grid w-full grid-cols-2 gap-3 rounded-2xl bg-secondary p-4 text-left text-sm">
        <dt className="text-muted-foreground">Total pagado</dt>
        <dd className="text-right font-semibold">{formatPrice(order.total)}</dd>
        <dt className="text-muted-foreground">Tarjeta</dt>
        <dd className="text-right font-semibold">•••• {order.payment.last4}</dd>
        <dt className="text-muted-foreground">Transacción</dt>
        <dd className="text-right font-mono text-xs font-semibold">{order.payment.transactionId}</dd>
      </dl>
      <button
        type="button"
        onClick={onClose}
        className="w-full rounded-full bg-primary px-6 py-4 text-sm font-medium text-primary-foreground"
      >
        Seguir explorando
      </button>
    </div>
  )
}
