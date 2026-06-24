'use client'

import Image from 'next/image'
import InkReveal from '@/components/ui/ink-reveal'

const PHOTO_URL =
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=80'

export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-paper select-none">
      {/* Full-bleed landscape sits beneath the cream mask */}
      <Image
        src={PHOTO_URL}
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        draggable={false}
        className="object-cover"
      />

      {/* Cream ink mask — moving the mouse reveals the landscape behind it */}
      <InkReveal maskColor={[239, 230, 210]} brushSize={140} lifetime={1400} />

      {/* Literary copy, fixed above the canvas */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <p className="eyebrow">An essay in code</p>

        <h1 className="literary mt-8 text-5xl italic font-light text-ink sm:text-6xl md:text-8xl leading-[0.95]">
          Namish <span className="crimson">Mannepalli</span>
        </h1>

        <p className="literary mt-6 max-w-xl text-base italic text-ink-soft sm:text-lg">
          A correspondent in software — full-stack, security, and the
          quiet machinery of AI — written from Cal Poly, San Luis Obispo.
        </p>

        <a
          href="mailto:namishmannepalli2024@gmail.com"
          className="literary pointer-events-auto mt-10 text-base italic text-ink underline decoration-crimson/60 underline-offset-[10px] transition-colors hover:decoration-crimson sm:text-lg"
        >
          Begin a correspondence
        </a>

        <p className="eyebrow absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
          drag your cursor across the page
        </p>
      </div>
    </section>
  )
}
