# Configuration

## Adding the plugin

Add the plugin to your `myst.yml`:

```yaml
project:
  plugins:
    - path/to/myst-iconify/src/index.mjs
```

Or use the bundled version after running `npm run build`:

```yaml
project:
  plugins:
    - path/to/myst-iconify/dist/index.mjs
```

## Building the plugin

```bash
npm install
npm run build
```

## Caching

Icons fetched from the Iconify API are cached in `_build/cache/iconify/`. Cached icons are reused indefinitely - delete the cache directory to re-fetch:

```bash
rm -rf _build/cache/iconify/
```

## Authentication

The Iconify public API does not require authentication. No API key is needed.

## Offline builds

For offline or CI builds, run `myst build` once with network access to populate the cache. Subsequent builds will use the cached icons as long as the `_build/cache/` directory is preserved.
