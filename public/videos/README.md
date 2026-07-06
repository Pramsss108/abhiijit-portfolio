# Video showcase upload map

The portfolio already contains six working viewer slots:

| Slot ID | Format | Recommended file |
|---|---|---|
| `reel-01` | 9:16 portrait | `reel-01.mp4` |
| `reel-02` | 9:16 portrait | `reel-02.mp4` |
| `reel-03` | 9:16 portrait | `reel-03.mp4` |
| `reel-04` | 9:16 portrait | `reel-04.mp4` |
| `landscape-01` | 16:9 landscape | `landscape-01.mp4` |
| `landscape-02` | 16:9 landscape | `landscape-02.mp4` |

After placing the final files here, set the matching button's `data-video-src`
in `public/v3/index.html`, for example:

```html
data-video-src="/videos/reel-01.mp4"
```

Also update `content/evidence-manifest.json` under `videoShowcase.slots`.

Use MP4/H.264 for broad browser support. Keep portrait samples below roughly
12 MB and landscape samples below roughly 20 MB where possible. Add a poster
image later so videos do not download before the visitor intentionally opens one.
