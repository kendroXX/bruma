'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { MENU, formatPrice, type Product } from '@/lib/menu'
import { ProductModal } from './product-modal'

export function MenuSection() {
  const [selected, setSelected] = useState<Product | null>(null)

  return (
    <section id="menu" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 md:py-24">
      <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase">Nuestro menú</p>
          <h2 className="font-serif text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Favoritos de temporada
          </h2>
        </div>
        <p className="max-w-sm leading-relaxed text-muted-foreground">
          Toca cualquier plato para ver sus ingredientes y añadirlo a tu pedido.
        </p>
      </div>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MENU.map((product) => (
          <li key={product.id}>
            <button
              type="button"
              onClick={() => setSelected(product)}
              className="group flex h-full w-full flex-col gap-4 rounded-3xl bg-card p-3 text-left text-card-foreground transition-transform hover:-translate-y-1 focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src={product.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 px-2 pb-2">
                <span className="text-xs font-medium tracking-widest text-accent uppercase">{product.category}</span>
                <h3 className="font-serif text-2xl font-semibold">{product.name}</h3>
                <p className="text-sm leading-relaxed text-card-foreground/70">{product.description}</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <span className="font-serif text-xl font-semibold">{formatPrice(product.price)}</span>
                  <span
                    aria-hidden="true"
                    className="flex size-11 items-center justify-center rounded-full bg-card-foreground text-card transition-transform group-hover:rotate-90"
                  >
                    <Plus className="size-5" />
                  </span>
                </div>
              </div>
              <span className="sr-only">Ver detalles y añadir {product.name}</span>
            </button>
          </li>
        ))}
      </ul>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
