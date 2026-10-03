# zone-editor

Draw polygonal zones on a map and check them as you edit: self-intersecting
outlines, overlapping zones, simplification with a preview. Built with React and
TypeScript on top of [zonekit](https://github.com/DarioScianna/zonekit)
([npm](https://www.npmjs.com/package/@darioscianna/zonekit)).

Work in progress.

## Development

Requires Node 22 or later.

```bash
npm install
npm run dev        # http://localhost:5173
npm test
npm run lint
npm run typecheck
npm run build      # static site in dist/, served from /zone-editor/
```

## License

MIT
