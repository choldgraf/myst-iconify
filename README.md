# myst-iconify

MyST plugin to render inline icons via the [Iconify API](https://iconify.design).
Provides access to 200,000+ icons from 100+ icon sets (Material Design, FontAwesome, etc.).

## Installation

Add to your `myst.yml`:

```yaml
project:
  plugins:
    - path/to/myst-iconify/src/index.mjs
```

Or use the bundled version:

```yaml
project:
  plugins:
    - path/to/myst-iconify/dist/index.mjs
```

## Usage

Use the `{icon}` role with an Iconify icon identifier (`prefix:name`):

```markdown
{icon}`mdi:home` Home page

{icon}`fa6-solid:star` Favorite

{icon}`home` also works (defaults to mdi prefix)
```

Browse available icons at https://icon-sets.iconify.design

## Building

```bash
npm install
npm run build
```

## Development

Icons are fetched from the Iconify API at build time and cached locally in `_build/cache/iconify/`.
