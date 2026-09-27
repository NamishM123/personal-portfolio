"use client"

import MorphGallery from "@/components/ui/morph-gallery"

const ITEMS = [
  { src: "/scenery/scenery1.png", thumb: "/scenery/scenery1.png", alt: "Misty layered ridges at dawn" },
  { src: "/scenery/scenery2.png", thumb: "/scenery/scenery2.png", alt: "Snow peak under the Milky Way" },
  { src: "/scenery/scenery3.png", thumb: "/scenery/scenery3.png", alt: "Alpine peak above a sea of clouds" },
  { src: "/scenery/scenery4.png", thumb: "/scenery/scenery4.png", alt: "Desert canyon at dusk" },
]

export default function Demo() {
  // w-full is load-bearing: 21st centres every demo inside a
  // `flex justify-center items-center` wrapper, and a flex item left at
  // width:auto shrinks to fit its contents — which, with a child asking for
  // 100%, resolves to 0px wide.
  return (
    <div className="relative w-full">
      <MorphGallery items={ITEMS} autoplay={4500} />
    </div>
  )
}
