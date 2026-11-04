export type Product = {
  id: string
  name: string
  category: string
  description: string
  details: string
  ingredients: string[]
  price: number
  image: string
}

export const MENU: Product[] = [
  {
    id: 'latte-canela',
    name: 'Latte de Canela',
    category: 'Bebida caliente',
    description: 'Espresso doble, leche texturizada y canela de Ceilán.',
    details:
      'Nuestro blend de la casa extraído en doble, con leche entera texturizada a 65 °C y un toque de canela recién molida. Suave, especiado y reconfortante.',
    ingredients: ['Espresso doble', 'Leche entera', 'Canela de Ceilán', 'Azúcar de caña (opcional)'],
    price: 4.5,
    image: '/images/latte-canela.png',
  },
  {
    id: 'croissant-almendra',
    name: 'Croissant de Almendra',
    category: 'Panadería',
    description: 'Hojaldre de mantequilla relleno de crema de almendra.',
    details:
      'Masa laminada durante 48 horas con mantequilla francesa, rellena de frangipane casero y horneada cada mañana. Terminado con almendra laminada y azúcar glas.',
    ingredients: ['Harina de trigo', 'Mantequilla AOP', 'Crema de almendra', 'Almendra laminada', 'Azúcar glas'],
    price: 3.8,
    image: '/images/croissant.png',
  },
  {
    id: 'cold-brew-naranja',
    name: 'Cold Brew de Naranja',
    category: 'Bebida fría',
    description: 'Infusión en frío de 18 horas con piel de naranja.',
    details:
      'Café de Etiopía infusionado en frío durante 18 horas, servido sobre hielo con un twist de naranja confitada. Notas cítricas, chocolate y cuerpo sedoso.',
    ingredients: ['Café de Etiopía', 'Agua filtrada', 'Hielo', 'Piel de naranja'],
    price: 5.2,
    image: '/images/cold-brew.png',
  },
  {
    id: 'tostada-aguacate',
    name: 'Tostada de Aguacate',
    category: 'Brunch',
    description: 'Masa madre, aguacate, huevo poché y chile.',
    details:
      'Pan de masa madre tostado con aguacate machacado, huevo poché de gallinas camperas, hojuelas de chile, aceite de oliva y brotes frescos.',
    ingredients: ['Pan de masa madre', 'Aguacate Hass', 'Huevo campero', 'Chile en hojuelas', 'Brotes verdes', 'AOVE'],
    price: 9.5,
    image: '/images/tostada.png',
  },
  {
    id: 'tarta-vasca',
    name: 'Tarta de Queso Vasca',
    category: 'Postre',
    description: 'Cremosa por dentro, caramelizada por fuera.',
    details:
      'Nuestra versión de la clásica tarta de La Viña: queso crema, nata y huevos, horneada a alta temperatura hasta lograr una superficie tostada y un centro fundente.',
    ingredients: ['Queso crema', 'Nata', 'Huevos', 'Azúcar', 'Harina'],
    price: 6.0,
    image: '/images/tarta.png',
  },
  {
    id: 'chai-especiado',
    name: 'Chai Especiado',
    category: 'Bebida caliente',
    description: 'Té negro, cardamomo, anís estrellado y leche.',
    details:
      'Té negro de Assam cocido a fuego lento con cardamomo, jengibre, clavo y anís estrellado. Terminado con leche espumada y un hilo de miel.',
    ingredients: ['Té negro Assam', 'Cardamomo', 'Jengibre', 'Anís estrellado', 'Leche', 'Miel'],
    price: 4.8,
    image: '/images/chai.png',
  },
]

export const MENU_BY_ID = new Map(MENU.map((p) => [p.id, p]))

export function formatPrice(value: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value)
}
