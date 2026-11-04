import type { Metadata } from 'next'
import { OrdersBoard } from '@/components/dashboard/orders-board'

export const metadata: Metadata = {
  title: 'Caja · Almendra',
  robots: { index: false, follow: false },
}

export default function DashboardPage() {
  return <OrdersBoard />
}
