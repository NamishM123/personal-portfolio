# ASCII effect source photo

`ref-008.png` is a **stand-in**, and swapping it for a real photo is the
single biggest upgrade available here.

The original reference frame lives at
`/ascii-editor/demos/generated/ref-008.webp` on 21st.dev, which this
environment could not reach. This file reproduces its composition — a
head-and-shoulders portrait lit hard from the upper left, dark room,
foliage at the left, cool window light raking the upper right — but the
figure is painted procedurally, so it reads as a mannequin rather than a
person. The effect only ever samples it through a 16px grid, which hides
a lot, but not everything.

To use your own photo, drop it in here and point the component at it:

```tsx
<AsciiEffect src="/ascii/your-photo.jpg" />
```

Anything the browser can decode works. What reads best through the grid:

- a **portrait**, framed head-and-shoulders, subject centred
- **hard directional light** — one bright side, one side falling into
  shadow, so the eyes, nose and jaw survive being averaged into cells
- a **dark, uncluttered background**, so the subject is the only thing
  with tone in the frame

The layout assumes the head sits in the upper third: the hero copy is
positioned below it, and its scrim is weighted to the lower half.
