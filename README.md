# Typography Playground

This workspace contains a simple static HTML/CSS playground for testing typography and layout ideas.

## Image optimization

Install the project dependencies with `npm install`. Export original, full-resolution PNG, JPEG, or WebP images
from Figma into `images/source/`, keeping any desired subfolder structure, then run `npm run images:optimize`.
Generated WebP files are written to `images/optimized/` with matching folder names. The optimizer uses quality 85
by default and quality 90 for filenames containing `-ui`, `-screen`, `-table`, or `-workflow`; it caps width at
2000px without enlarging images and removes metadata. Re-running the command skips unchanged inputs.

Run `npm run images:watch` to optimize images as they are added or modified. Commit generated files from
`images/optimized/` and reference those files from the site; GitHub Pages serves them directly, with no Node.js or
build step required at runtime. Original files in `images/source/` are ignored by Git and are not deployed. **Back up
all original, full-resolution exports separately** (for example, in a secure cloud drive or project archive).

## Files

- `index.html` — the page structure and content
- `styles.css` — the visual styling and layout system

## Open it locally

Open `index.html` in a browser to start experimenting.

You can also run a simple local server from this folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Quick ideas to test

- Change type scale and line-height
- Adjust margin and padding values
- Try different grid layouts
- Test different font stacks and spacing systems
- Create new sections for headings, cards, and long-form text
