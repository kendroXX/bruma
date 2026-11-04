import { CartProvider } from '@/components/cart/cart-context'
import { CartSheet } from '@/components/cart/cart-sheet'
import { Hero } from '@/components/site/hero'
import { MenuSection } from '@/components/site/menu-section'
import { OurStory } from '@/components/site/our-story'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'

export default function HomePage() {
  return (
    <CartProvider>
      <SiteHeader />
      <main>
        <Hero />
        <OurStory />
        <MenuSection />
      </main>
      <SiteFooter />
      <CartSheet />
    </CartProvider>
  )
}
