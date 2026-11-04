'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Minus, Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useCart } from '@/components/cart/cart-context'
import { formatPrice, type Product } from '@/lib/menu'
import { MAX_QTY_PER_ITEM } from '@/lib/orders'

export function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  return (
    <Dialog open={product !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="gap-0 overflow-hidden rounded-3xl p-0 sm:max-w-3xl">
        {product && <ProductBody key={product.id} product={product} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  )
}

function ProductBody({ product, onClose }: { product: Product; onClose: () => void }) {
  const [quantity, setQuantity] = useState(1)
  const { add, setOpen } = useCart()

  return (
    <div className="grid md:grid-cols-2">
      <div className="relative aspect-square md:aspect-auto">
        <Image src={product.image} alt={product.name} fill sizes="(min-width: 768px) 384px, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-col gap-5 p-6 md:p-8">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">{product.category}</span>
          <DialogTitle className="font-serif text-3xl font-semibold">{product.name}</DialogTitle>
          <DialogDescription className="text-base leading-relaxed text-muted-foreground">
            {product.details}
          </DialogDescription>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-semibold">Ingredientes</h4>
          <ul className="flex flex-wrap gap-2">
            {product.ingredients.map((ing) => (
              <li key={ing} className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                {ing}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 border-t pt-5">
          <div className="flex items-center gap-1 rounded-full border p-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex size-9 items-center justify-center rounded-full hover:bg-secondary"
              aria-label="Quitar uno"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-8 text-center font-semibold" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(MAX_QTY_PER_ITEM, q + 1))}
              className="flex size-9 items-center justify-center rounded-full hover:bg-secondary"
              aria-label="Añadir uno"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <span className="font-serif text-2xl font-semibold">{formatPrice(product.price * quantity)}</span>
        </div>

        <button
          type="button"
          onClick={() => {
            add(product.id, quantity)
            onClose()
            setOpen(true)
          }}
          className="rounded-full bg-primary px-6 py-4 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-px"
        >
          Añadir al pedido
        </button>
      </div>
    </div>
  )
}
