# ASCII effect source photo

`ref-008.png` is a **stand-in**. The original reference frame lives at
`/ascii-editor/demos/generated/ref-008.webp` on 21st.dev, which this
environment could not reach, so this file was generated to match the
reference render's composition: dark interior, warm desk-lamp bloom just
above centre, foliage highlights at the left, cool window light raking
across the upper right, lit desk surface along the bottom.

To use a different photo, drop it in here and point the component at it:

```tsx
<AsciiEffect src="/ascii/your-photo.jpg" />
```

Anything the browser can decode works. The effect cover-fits the image to
the canvas, so a wide landscape shot with one clear bright area reads best.
