'use client'

import { Coffee, ShoppingBag } from 'lucide-react'
import { useCart } from '@/components/cart/cart-context'

const LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#historia', label: 'Historia' },
  { href: '#menu', label: 'Menú' },
  { href: '#visita', label: 'Visítanos' },
]

export function SiteHeader() {
  const { count, setOpen } = useCart()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-5">
        <a href="#inicio" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Coffee className="size-4" aria-hidden="true" />
          </span>
          <span className="font-serif text-xl font-semibold tracking-tight">Almendra</span>
        </a>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm font-medium">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-muted-foreground transition-colors hover:text-foreground">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full bg-primary py-2.5 pr-3 pl-4 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-px"
        >
          <ShoppingBag className="size-4" aria-hidden="true" />
          Ver mi pedido
          <span
            className="flex min-w-6 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-xs font-semibold text-accent-foreground"
            aria-label={`${count} productos`}
          >
            {count}
          </span>
        </button>
      </div>
    </header>
  )
}
