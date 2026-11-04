'use client'

import { createContext, useContext, useMemo, useState } from 'react'
import { MENU_BY_ID, type Product } from '@/lib/menu'
import { MAX_QTY_PER_ITEM } from '@/lib/orders'

type CartLine = { product: Product; quantity: number }

type CartContextValue = {
  lines: CartLine[]
  count: number
  total: number
  isOpen: boolean
  setOpen: (open: boolean) => void
  add: (productId: string, quantity?: number) => void
  setQuantity: (productId: string, quantity: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [isOpen, setOpen] = useState(false)

  const value = useMemo<CartContextValue>(() => {
    const lines = Object.entries(quantities)
      .filter(([, q]) => q > 0)
      .map(([id, quantity]) => ({ product: MENU_BY_ID.get(id)!, quantity }))
    return {
      lines,
      count: lines.reduce((a, l) => a + l.quantity, 0),
      total: lines.reduce((a, l) => a + l.quantity * l.product.price, 0),
      isOpen,
      setOpen,
      add: (id, quantity = 1) =>
        setQuantities((prev) => ({ ...prev, [id]: Math.min(MAX_QTY_PER_ITEM, (prev[id] ?? 0) + quantity) })),
      setQuantity: (id, quantity) =>
        setQuantities((prev) => ({ ...prev, [id]: Math.max(0, Math.min(MAX_QTY_PER_ITEM, quantity)) })),
      clear: () => setQuantities({}),
    }
  }, [quantities, isOpen])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
