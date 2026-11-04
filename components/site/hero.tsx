import Image from 'next/image'
import { ArrowDown, Star } from 'lucide-react'

export function Hero() {
  return (
    <section id="inicio" className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 md:py-20 lg:grid-cols-2">
      <div className="flex flex-col gap-7">
        <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
          Café de especialidad · desde 2014
        </p>
        <h1 className="font-serif text-5xl leading-none font-semibold tracking-tight text-balance md:text-7xl">
          Más que solo <em className="font-normal italic">café</em>.
        </h1>
        <p className="max-w-md text-lg leading-relaxed text-pretty text-muted-foreground">
          Granos tostados en casa, panadería horneada al amanecer y una mesa que te espera. Pide desde tu
          sitio y nosotros nos encargamos del resto.
        </p>
        <div>
          <a
            href="#menu"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Explorar el menú
            <ArrowDown className="size-4" aria-hidden="true" />
          </a>
        </div>
        <dl className="flex gap-10 border-t pt-7">
          <div className="flex flex-col gap-1">
            <dt className="text-sm text-muted-foreground">Clientes felices</dt>
            <dd className="order-first font-serif text-3xl font-semibold">12k+</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-sm text-muted-foreground">Calificación media</dt>
            <dd className="order-first flex items-center gap-1.5 font-serif text-3xl font-semibold">
              4.9 <Star className="size-5 fill-accent text-accent" aria-hidden="true" />
            </dd>
          </div>
        </dl>
      </div>

      <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] rounded-tl-[10rem] shadow-2xl shadow-primary/20">
        <Image
          src="/images/hero-cafe.png"
          alt="Interior de la cafetería Almendra con iluminación cálida"
          fill
          priority
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-cover"
        />
      </div>
    </section>
  )
}
