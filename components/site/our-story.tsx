import Image from 'next/image'
import { Flame, HandHeart, Leaf, Wheat } from 'lucide-react'

const FEATURES = [
  { icon: Leaf, title: 'Sustainably Sourced', text: 'Comercio directo con fincas de Colombia y Etiopía.' },
  { icon: Flame, title: 'Locally Roasted', text: 'Tostamos cada semana en nuestro taller del barrio.' },
  { icon: Wheat, title: 'Baked Daily', text: 'Masa madre y bollería recién salidas del horno.' },
  { icon: HandHeart, title: 'Community First', text: 'Un rincón para leer, trabajar y quedarse.' },
]

export function OurStory() {
  return (
    <section id="historia" aria-labelledby="historia-title">
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:py-28 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-6">
            <p className="text-sm font-medium tracking-widest text-accent uppercase">Our Story</p>
            <h2 id="historia-title" className="font-serif text-4xl leading-tight font-semibold text-balance md:text-5xl">
              Empezó con una taza y un libro <em className="font-normal italic">a medio leer</em>.
            </h2>
            <div className="flex max-w-lg flex-col gap-4 leading-relaxed text-pretty text-primary-foreground/75">
              <p>
                En 2014 abrimos Almendra en un antiguo local de encuadernación. Queríamos un lugar donde el café se
                tomara sin prisa, con la misma atención que se le da a una buena página.
              </p>
              <p>
                Hoy seguimos tostando en pequeños lotes, conociendo por su nombre a quienes cultivan nuestros granos y
                guardando siempre una mesa junto a la ventana.
              </p>
            </div>
            <p className="font-serif text-lg italic text-accent">— Lucía y Martín, fundadores</p>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] rounded-br-[10rem] lg:order-last">
            <Image
              src="/images/cafe-libro.png"
              alt="Taza de café humeante sobre un libro abierto en una mesa de madera"
              fill
              sizes="(min-width: 1024px) 520px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="border-b bg-secondary">
        <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-accent">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-serif text-lg font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
