# slides.johnsonlee.io

A lightweight slide framework built on [Reveal.js](https://revealjs.com), hosted on GitHub Pages as a CDN for downstream presentation sites.

## Quick Start

```html
<head>
  <link rel="stylesheet" href="https://slides.johnsonlee.io/slides.css">
</head>
<body>
  <script src="https://slides.johnsonlee.io/slides.js"></script>
  <script>
    Slides.init({
      title: 'My Presentation',
      chapters: ['cover', 'chapter-1', 'chapter-2'],
      langs: { en: 'EN', zh: '中文' }
    });
  </script>
</body>
```

## What `Slides.init(config)` Does

1. Injects Reveal.js CSS (reset, reveal, night theme, monokai)
2. Reads `?lang=` from URL, sets `document.documentElement.lang`
3. Creates language toggle button (if multilingual)
4. Builds `<div class="reveal"><div class="slides">` with `<section data-markdown>` per chapter
5. Loads Reveal.js core + plugins (markdown, highlight, notes, search)
6. Calls `Reveal.initialize()` with sensible defaults
7. Auto-layout: centers sparse slides, stretches single lists, spaces multi-block slides
8. Loads MathJax 3 for LaTeX formula rendering
9. Updates `document.title` dynamically on slide change

## Config

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | `string` | Yes | Site title for `<title>` tag |
| `chapters` | `string[]` | Yes | Markdown filenames without `.md` extension |
| `langs` | `{ code: label }` | No | Language map, e.g. `{ en: 'EN', zh: '中文' }` |
| `reveal` | `object` | No | Override Reveal.js init options |

## Content Structure

Markdown files are loaded from `src/{lang}/{chapter}.md`:

```
src/
  en/
    cover.md
    chapter-1.md
  zh/
    cover.md
    chapter-1.md
```

## CSS Customization

Override accent color via CSS custom properties:

```css
:root {
  --slides-accent: #e7ad52;
  --slides-accent-rgb: 231, 173, 82;
}
```

## Auto-Layout Classes

| Class | Applied by | Purpose |
|-------|-----------|---------|
| `.center` | JS (auto) or Markdown directive | Centers slide content |
| `.stretch-list` | JS (auto) | Stretches a single list to fill remaining space |
| `.spaced-block` | JS (auto) | Adds top margin between multiple content blocks |
| `.two-columns` | Markdown author | Two-column list layout (overrides `.stretch-list`) |

## Slide Types

Use `<!-- .slide: class="center" -->` as the first line of a slide for centered layout (cover pages, chapter titles). Default layout is top-left aligned with flexbox column.

## LaTeX Support

Inline math with `$...$` or `\(...\)`:

```markdown
The loss function is $L = -\sum p(x) \log q(x)$.
```

## Example

See it in action: [llm.johnsonlee.io](https://llm.johnsonlee.io)

## License

MIT
