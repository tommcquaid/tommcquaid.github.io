# v2 — Portfolio Site (Astro)

Work-in-progress portfolio. Production lives on `main` → [mcquaidtom.com](https://mcquaidtom.com).

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

## Architecture

Content-driven publishing system. Case studies are **data files**, not layout code.

```
src/
  content/
    caseStudies/          One YAML file per project
  schemas/
    blocks.ts           Zod schemas + TypeScript types
  components/
    blocks/             One Astro component per block type
    BlockRenderer.astro Maps block.type → component
    CaseStudy.astro     Assembles hero + block stack
  pages/
    index.astro         Homepage (intro + case study tiles)
    about.astro         About
    writing.astro       Writing
    work/[slug].astro   Case study pages
  styles/               Global design system (CSS)
public/
  images/               Project assets (e.g. images/project-name/)
```

### Workflow: add a new case study

1. Duplicate `src/content/caseStudies/_template.yaml`
2. Rename to `your-project.yaml`
3. Fill in metadata (title, subtitle, role, year, etc.)
4. Set a homepage tile image with `preview.src` (optional `preview.alt`). Title and optional `subtitle` appear under the image.
5. Add a sequence of `blocks` — each block is `{ type, ...fields }`
6. Add images to `public/images/your-project/` and reference as `/images/your-project/file.jpg`
7. Set `draft: false` when ready to publish

No layout code, CSS, or component changes required.

### Block types

| `type` | Purpose |
|---|---|
| `thesis` | Large insight (optional `title` + `text`) |
| `narrative` | Headline + 1–3 paragraphs |
| `quote` | Stakeholder quote + optional `attribution` |
| `textVisual` | Split layout; set `reverse: true` to flip sides |
| `containedVisual` | Centered product visual (~75vw / 75vh) |
| `fullBleedVisual` | Edge-to-edge image |
| `visualGrid` | 2, 3, or 4 images (`columns` + `images[]`) |
| `metric` | Large numbers with labels |
| `process` | Step sequence; `vertical: true` to stack |
| `comparison` | Before/after side-by-side |
| `reflection` | Closing text + optional nav links |

The **hero card** is auto-generated from top-level metadata (`title`, `subtitle`, `label`, `role`, `team`, `cover`, etc.) — not a block.

Homepage tiles use `title`, optional `subtitle` as the subhead, and `preview` for the image (`preview.src` falls back to `cover` if omitted). Edit the homepage intro copy in `src/pages/index.astro`.

### Surface backgrounds

Every block (and the hero via top-level metadata) accepts an optional `background` token:

```yaml
background: sand   # hero
blocks:
  - type: narrative
    background: cream
    title: "The problem"
    paragraphs: [...]
```

Available tokens: `white` · `sand` · `stone` · `mist` · `sage` · `slate` · `cream` · `blush` · `sky` · `ink`

Token values live in `src/styles/tokens.css` — update once to change the palette globally. Dark token `ink` auto-inverts text within the card.

### Schema validation

Block shapes are validated at build time via Zod in `src/schemas/blocks.ts`. Invalid content fails the build with a clear error — no silent typos.

### Changing the design system

Edit CSS in `src/styles/` or block components in `src/components/blocks/`. All case studies update automatically.

## GitHub Pages

Build locally and deploy `dist/` to Pages, or add a GitHub Action:

```yaml
# .github/workflows/deploy.yml (when ready)
- run: npm ci && npm run build
- uses: actions/upload-pages-artifact@v3
  with:
    path: dist
```

## Sample project

`/work/sample-project/` — demonstrates every block type with placeholder visuals.
