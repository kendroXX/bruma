export function SiteFooter() {
  return (
    <footer id="visita" className="scroll-mt-20 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-3">
        <div className="flex flex-col gap-3">
          <p className="font-serif text-3xl font-semibold">Almendra</p>
          <p className="max-w-xs leading-relaxed text-primary-foreground/70">
            Café de especialidad, panadería artesanal y buena compañía.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-primary-foreground/60">Dirección</h2>
          <p className="leading-relaxed">Calle del Tostador 18<br />28010 Madrid</p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-primary-foreground/60">Horario</h2>
          <p className="leading-relaxed">Lun – Vie · 7:30 – 20:00<br />Sáb – Dom · 9:00 – 21:00</p>
        </div>
      </div>
    </footer>
  )
}
