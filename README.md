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

## Auto-Layout

The JS engine inspects each slide's DOM after Markdown rendering and automatically applies layout classes. No manual configuration needed.

### 1. Centered (`.center`) — auto or manual

Heading + at most one line of text, no list/table/image → auto-centered.
Also triggered by `<!-- .slide: class="center" -->` directive.

```
┌──────────────────────────────────────────────┐
│                                              │
│                                              │
│             ## Chapter Title                 │
│                                              │
│          *A short tagline here*              │
│                                              │
│                                              │
└──────────────────────────────────────────────┘
```

### 2. Heading + Short List (`.stretch-list`) — auto

Heading + single `<ul>`/`<ol>` with ≤ 8 items → list stretches to fill remaining space, items evenly spaced.

```
┌──────────────────────────────────────────────┐
│ ## Heading                                   │
│                                              │
│ • Item A                                     │
│                                              │
│ • Item B                                     │
│                                              │
│ • Item C                                     │
│                                              │
│ • Item D                                     │
│                                              │
└──────────────────────────────────────────────┘
```

### 3. Heading + Long List (`.auto-columns`) — auto

Heading + single list with > 8 items → automatically splits into `ceil(N/8)` columns via CSS `columns`.

```
9 items → ceil(9/8) = 2 columns

┌──────────────────────────────────────────────┐
│ ## Heading                                   │
│                                              │
│ • Item 1          • Item 6                   │
│ • Item 2          • Item 7                   │
│ • Item 3          • Item 8                   │
│ • Item 4          • Item 9                   │
│ • Item 5                                     │
│                                              │
└──────────────────────────────────────────────┘

17 items → ceil(17/8) = 3 columns

┌──────────────────────────────────────────────┐
│ ## Heading                                   │
│                                              │
│ • Item 1     • Item 7      • Item 13         │
│ • Item 2     • Item 8      • Item 14         │
│ • Item 3     • Item 9      • Item 15         │
│ • Item 4     • Item 10     • Item 16         │
│ • Item 5     • Item 11     • Item 17         │
│ • Item 6     • Item 12                       │
│                                              │
└──────────────────────────────────────────────┘
```

### 4. Heading + Table — default flexbox

Heading stays top-left, table fills available width below.

```
┌──────────────────────────────────────────────┐
│ ## Heading                                   │
│                                              │
│ ┌────────────┬──────────┬──────────────────┐ │
│ │ Name       │ Year     │ Notes            │ │
│ ├────────────┼──────────┼──────────────────┤ │
│ │ A          │ 2020     │ ...              │ │
│ │ B          │ 2021     │ ...              │ │
│ │ C          │ 2022     │ ...              │ │
│ └────────────┴──────────┴──────────────────┘ │
│                                              │
└──────────────────────────────────────────────┘
```

### 5. Heading + Image — default flexbox

Heading stays top-left, image centered in remaining space (via CSS `p:has(> img)`).

```
┌──────────────────────────────────────────────┐
│ ## Heading                                   │
│                                              │
│                                              │
│              ┌──────────────┐                │
│              │    <img>     │                │
│              └──────────────┘                │
│                                              │
│                                              │
└──────────────────────────────────────────────┘
```

### 6. Multi-Block (`.spaced-block`) — auto

Heading + multiple content blocks → blocks from the 2nd onward get top margin.

```
┌──────────────────────────────────────────────┐
│ ## Heading                                   │
│                                              │
│ First paragraph or list...                   │
│                                              │
│                 ↕ 1.5em                      │
│                                              │
│ Second paragraph or list...                  │
│                                              │
│                 ↕ 1.5em                      │
│                                              │
│ > Blockquote                                 │
└──────────────────────────────────────────────┘
```

## LaTeX Support

Inline math with `$...$` or `\(...\)`:

```markdown
The loss function is $L = -\sum p(x) \log q(x)$.
```

## Example

See it in action: [llm.johnsonlee.io](https://llm.johnsonlee.io)

## License

MIT
