# Tom McQuaid — Product Design

Tom McQuaid’s portfolio site, featuring selected product design case studies, professional experience, and information about his work in product design and education.

## Local preview

This is a static site with no build step. Open `index.html` in a browser, or start a local server from the repository root:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Images

The site uses optimized images from `images/optimized/`. To regenerate them, install dependencies and run:

```bash
npm install
npm run images:optimize
```

To optimize images automatically as source files change, run `npm run images:watch`. Original images belong in `images/source/`; that directory is ignored by Git. Back up original, full-resolution exports separately.
