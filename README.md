# myst-iconify

MyST plugin to render inline icons via the [Iconify API](https://iconify.design).
This is a lightweight service that connects with many different icon sets out there.
It provides access to 200,000+ icons from 100+ icon sets (Material Design, FontAwesome, etc.).

> [!NOTE]
> 
> Right now, this will embed a base64 encoded image for each icon.
> Each is small (about .2-1kb per icon, depending on its complexity), but eventually we'd like to include these are files and re-use them.
> See this [issue on plugins defining their own outputs](https://github.com/jupyter-book/mystmd/issues/2714) and when it is resolved we'll implement that here.

## Installation

Add the plugin to your `myst.yml` - this always uses the latest release:

```yaml
project:
  plugins:
    - https://github.com/choldgraf/myst-iconify/releases/latest/download/index.mjs
```

To pin a specific version, use the release tag:

```yaml
project:
  plugins:
    - https://github.com/choldgraf/myst-iconify/releases/download/v0.1.0/index.mjs
```

## Usage

Use the `{icon}` role with an Iconify icon identifier (`prefix:name`):

```markdown
{icon}`mdi:home` Home page

{icon}`fa6-solid:star` Favorite

{icon}`home` also works (defaults to mdi prefix)
```

Browse available icons at https://icon-sets.iconify.design

## Adding the plugin

Add the plugin to your `myst.yml` - the config below always uses the latest release:

```yaml
project:
  plugins:
    - https://github.com/choldgraf/myst-iconify/releases/latest/download/index.mjs
```

To pin a specific version, use the release tag:

```yaml
project:
  plugins:
    - https://github.com/choldgraf/myst-iconify/releases/download/v0.1.0/index.mjs
```

## Caching

Icons fetched from the Iconify API are cached in `_build/cache/iconify/`. Delete the cache directory to re-fetch:

```bash
rm -rf _build/cache/iconify/
```

## Building

```bash
npm install
npm run build
```

## Development

Icons are fetched from the [Iconify API](https://api.iconify.design) **at build time**, then cached/embedded as inline SVGs that are base64-encoded.
