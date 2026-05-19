'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const services = [
  {
    label: '01 / Strategy',
    title: 'Digital Strategy',
    description:
      'Roadmaps, positioning and product thinking that translates ambition into shipped reality.',
  },
  {
    label: '02 / 3D Web',
    title: '3D Web Experiences',
    description:
      'Real-time WebGL worlds, interactive product showcases and immersive brand storytelling.',
  },
  {
    label: '03 / AI Integration',
    title: 'AI Integration',
    description:
      'Custom AI agents, vision pipelines and generative tools wired into your existing stack.',
  },
]

export function CyberLandingSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const heroTextRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !sectionRef.current || !stickyRef.current) return

    gsap.registerPlugin(ScrollTrigger)

    const canvas = canvasRef.current
    const sticky = stickyRef.current

    // --- Scene
    const scene = new THREE.Scene()

    // --- Camera
    const camera = new THREE.PerspectiveCamera(
      55,
      sticky.clientWidth / sticky.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, 0, 5)

    // --- Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    })
    renderer.setSize(sticky.clientWidth, sticky.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1

    // --- Torus Knot: frosted glass + dark metal, slight iridescence
    const geometry = new THREE.TorusKnotGeometry(1.1, 0.36, 220, 32)
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x0a0a12),
      roughness: 0.55,
      metalness: 0.4,
      transmission: 0.75,
      thickness: 0.9,
      ior: 1.4,
      iridescence: 0.6,
      iridescenceIOR: 1.3,
      clearcoat: 1.0,
      clearcoatRoughness: 0.35,
      attenuationColor: new THREE.Color(0x4a3aff),
      attenuationDistance: 2.5,
    })
    const torus = new THREE.Mesh(geometry, material)
    scene.add(torus)

    // --- Strict 3-point lighting
    // Key: strong neon blue directional, cutting across the object
    const keyLight = new THREE.DirectionalLight(0x2b6bff, 4.5)
    keyLight.position.set(5, 4, 3)
    scene.add(keyLight)

    // Fill: deep purple point light filling the shadows
    const fillLight = new THREE.PointLight(0x8a2bff, 6, 14)
    fillLight.position.set(-3.5, -2, 2.5)
    scene.add(fillLight)

    // Rim: subtle white rim from behind, separates from background
    const rimLight = new THREE.DirectionalLight(0xeaf2ff, 1.4)
    rimLight.position.set(0, 1, -5)
    scene.add(rimLight)

    // Ambient floor so the glass doesn't go pitch black
    scene.add(new THREE.AmbientLight(0x0a0a18, 0.6))

    // --- Camera "breathing" floating animation
    const cameraBase = new THREE.Vector3(0, 0, 5)
    let t = 0

    // --- Scroll-driven camera push and rotation
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    })
    scrollTl
      .to(cameraBase, { z: 1.8, duration: 1, ease: 'power2.inOut' }, 0)
      .to(torus.rotation, { y: Math.PI * 1.2, x: Math.PI * 0.6, duration: 1 }, 0)
      .to(fillLight.position, { x: 3, y: 2, duration: 1 }, 0)

    // --- Hero text and cards scroll fades
    if (heroTextRef.current) {
      gsap.to(heroTextRef.current, {
        opacity: 0,
        y: -60,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '40% top',
          scrub: 1,
        },
      })
    }
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll<HTMLElement>('[data-card]')
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 1,
            },
            delay: i * 0.05,
          }
        )
      })
    }

    // --- Render loop with breathing camera
    let raf = 0
    const animate = () => {
      t += 0.005

      torus.rotation.x += 0.0018
      torus.rotation.z += 0.0012

      camera.position.x = cameraBase.x + Math.sin(t * 0.6) * 0.18
      camera.position.y = cameraBase.y + Math.cos(t * 0.45) * 0.12
      camera.position.z = cameraBase.z + Math.sin(t * 0.3) * 0.05
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    // --- Resize
    const onResize = () => {
      if (!sticky) return
      const w = sticky.clientWidth
      const h = sticky.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      ScrollTrigger.getAll().forEach((st) => st.kill())
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative bg-gradient-to-b from-[#050507] via-[#0a0a12] to-[#101018] text-white overflow-hidden"
      style={{ minHeight: '260vh' }}
      id="agency"
    >
      {/* Sticky 3D canvas + overlays */}
      <div ref={stickyRef} className="sticky top-0 h-screen w-full">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* Subtle vignette to deepen edges */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.7)_100%)]" />

        {/* Hero text overlay */}
        <div
          ref={heroTextRef}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center pointer-events-none"
        >
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.4em] text-blue-300/70">
            Cyber · Minimal · Real-time
          </p>
          <h2 className="font-bold tracking-[-0.04em] leading-[0.9] text-[clamp(2.75rem,9vw,9rem)]">
            WE BUILD
            <br />
            <span className="bg-gradient-to-r from-blue-300 via-white to-purple-300 bg-clip-text text-transparent">
              DIGITAL REALITIES
            </span>
          </h2>
          <p className="mt-8 max-w-xl text-neutral-300/80 text-base md:text-lg">
            A 3D web studio engineering immersive interfaces at the intersection
            of design, physics and AI.
          </p>
          <button
            type="button"
            className="pointer-events-auto mt-10 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-medium tracking-wide text-white shadow-[0_0_40px_-10px_rgba(80,120,255,0.6)] backdrop-blur-xl transition-all hover:bg-white/10 hover:shadow-[0_0_60px_-10px_rgba(120,80,255,0.8)]"
          >
            <span>Start a project</span>
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      {/* Service cards layered over the 3D scene */}
      <div
        ref={cardsRef}
        className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 pb-40 pt-12 -mt-[60vh]"
      >
        <div className="mb-12 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-blue-300/70 mb-3">
            What we do
          </p>
          <h3 className="text-3xl md:text-5xl font-bold tracking-tight">
            Capabilities, distilled.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              data-card
              className="group rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl transition-all hover:border-white/20 hover:bg-white/[0.07]"
            >
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-blue-300/80 mb-4">
                {s.label}
              </p>
              <h4 className="text-2xl font-bold mb-3 text-white">{s.title}</h4>
              <p className="text-sm leading-relaxed text-neutral-300/80">
                {s.description}
              </p>
              <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="mt-4 flex items-center justify-between text-xs text-neutral-400">
                <span className="font-mono uppercase tracking-widest">Learn more</span>
                <span aria-hidden>↗</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
