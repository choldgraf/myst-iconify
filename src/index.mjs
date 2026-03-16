// Iconify Plugin for MyST
// Renders inline icons from the Iconify API.
// Browse icons at https://icon-sets.iconify.design
//
// How it works:
//   1. The {icon} role emits a placeholder node during parsing.
//   2. The transform collects all placeholders, fetches SVGs from the
//      Iconify API, and replaces each placeholder with an inline span
//      using a background-image data URI. We use span (not image) because
//      MyST's image renderer strips inline styles, but spans preserve them.
//   3. We generally keep the styles etc the same as what iconify returns.

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const ICONIFY_API = 'https://api.iconify.design';
const DEFAULT_PREFIX = 'mdi';
const CACHE_DIR = '_build/cache/iconify';

// Normalize role input to "prefix:name"
// If no prefix, choose mdi.
function normalize(raw) {
  const s = raw.trim();
  return s.includes(':') ? s : `${DEFAULT_PREFIX}:${s}`;
}

// Fetch an icon SVG and cache to _build/cache/iconify/{prefix}/{name}.svg
async function fetchIcon(key) {
  const [prefix, name] = key.split(':');
  const cachePath = join(CACHE_DIR, prefix, `${name}.svg`);
  if (existsSync(cachePath)) return readFileSync(cachePath, 'utf8');
  try {
    const res = await fetch(`${ICONIFY_API}/${prefix}/${name}.svg`);
    if (!res.ok) return null;
    const svg = await res.text();
    mkdirSync(join(CACHE_DIR, prefix), { recursive: true });
    writeFileSync(cachePath, svg);
    return svg;
  } catch {
    return null;
  }
}

const plugin = {
  name: 'Iconify Icons',
  roles: [
    {
      name: 'icon',
      doc: 'Inline icon from Iconify. Usage: {icon}`mdi:home` or {icon color=red}`home`',
      body: { type: String, required: true },
      options: {
        color: { type: String, doc: 'CSS color for the icon (e.g. red, #ff0000).' },
      },
      run(data) {
        return [{ type: 'iconifyPlaceholder', key: normalize(data.body), color: data.options?.color }];
      },
    },
  ],
  transforms: [
    {
      name: 'iconify-resolve',
      stage: 'document',
      plugin: (_, utils) => async (tree) => {
        const nodes = utils.selectAll('iconifyPlaceholder', tree);
        if (!nodes.length) return;

        // Fetch each icon only once - if they're in the cache it'll just instantly return.
        const keys = [...new Set(nodes.map((n) => n.key))];
        const svgs = {};
        await Promise.all(keys.map(async (k) => { svgs[k] = await fetchIcon(k); }));

        // Replace each placeholder in-place with a styled span node.
        for (const node of nodes) {
          const { key, color } = node;
          const svg = svgs[key];
          Object.keys(node).forEach((k) => delete node[k]);
          if (!svg) {
            console.warn(`⚠️  iconify: could not fetch icon "${key}" - check the name at https://icon-sets.iconify.design`);
            Object.assign(node, { type: 'text', value: `[${key}]` });
          } else {
            // If a color was specified, replace currentColor in the SVG before encoding.
            const finalSvg = color ? svg.replace(/currentColor/g, color) : svg;
            const dataUri = `data:image/svg+xml;base64,${Buffer.from(finalSvg).toString('base64')}`;
            Object.assign(node, {
              // We use a span because image nodes will get styled in weird ways by myst theme
              type: 'span',
              class: 'iconify-icon',
              style: {
                display: 'inline-block',
                verticalAlign: '-0.125em',
                width: '1em',
                height: '1em',
                backgroundImage: `url("${dataUri}")`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
              },
              children: [],
            });
          }
        }
      },
    },
  ],
};

export default plugin;
