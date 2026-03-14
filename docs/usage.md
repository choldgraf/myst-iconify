# Usage

Inline icons from [Iconify](https://iconify.design) — over 200,000 icons from 100+ icon sets, resolved at build time.

## The `{icon}` role

Use the `{icon}` role with any icon identifier in `prefix:name` format.
Browse available icons at [icon-sets.iconify.design](https://icon-sets.iconify.design).

### Basic usage

:::::{myst:demo}
- {icon}`mdi:home` Home
- {icon}`mdi:github` GitHub
- {icon}`mdi:rocket-launch` Launch
- {icon}`mdi:book-open-variant` Documentation
:::::

### Default prefix

Icons without a prefix default to Material Design Icons (`mdi`):

:::::{myst:demo}
- {icon}`home` Home
- {icon}`star` Star
:::::

### Popular icon sets

:::::{myst:demo}
**Material Design Icons** (`mdi`):
{icon}`mdi:check-circle` {icon}`mdi:alert` {icon}`mdi:information` {icon}`mdi:close-circle`

**Font Awesome** (`fa6-solid`):
{icon}`fa6-solid:star` {icon}`fa6-solid:heart` {icon}`fa6-solid:bell` {icon}`fa6-solid:gear`

**Lucide** (`lucide`):
{icon}`lucide:rocket` {icon}`lucide:zap` {icon}`lucide:globe` {icon}`lucide:terminal`

**Brand Logos** (`logos`):
{icon}`logos:python` {icon}`logos:jupyter` {icon}`logos:react` {icon}`logos:github-icon`
:::::

### Inline in text

:::::{myst:demo}
Icons render inline: click the {icon}`mdi:cog` settings icon, then look for the {icon}`mdi:shield-check` security tab.
:::::

### As linked icons

:::::{myst:demo}
[{icon}`mdi:github` Source code](https://github.com/jupyter-book/myst-iconify)
[{icon}`mdi:book-open-variant` Documentation](https://mystmd.org)
:::::

## How it works

Icons are fetched from the [Iconify API](https://api.iconify.design) **at build time** and embedded as inline SVGs. No runtime CDN dependency — the SVGs are baked into your site's HTML.

Results are cached in `_build/cache/iconify/`.
