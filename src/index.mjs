// Iconify Plugin for MyST
// Renders inline icons from the Iconify API (200k+ icons, 100+ sets).
// Usage: {icon}`mdi:home` or {icon}`home` (defaults to mdi prefix)
// Browse icons at https://icon-sets.iconify.design
//
// How it works:
//   1. The {icon} role emits a placeholder node during parsing.
//   2. The transform collects all placeholders, fetches SVGs from the
//      Iconify API (deduped, cached to disk), and replaces each placeholder
//      with an inline <img> using a base64 data URI.
//   3. Mono-color icons inherit text color via CSS currentColor (set by Iconify).
//      Multi-color icons (e.g. logos:python) keep their original colors.

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const ICONIFY_API = 'https://api.iconify.design';
const DEFAULT_PREFIX = 'mdi';
const CACHE_DIR = '_build/cache/iconify';

// Normalize role input to "prefix:name", defaulting to mdi.
function normalize(raw) {
  const s = raw.trim();
  return s.includes(':') ? s : `${DEFAULT_PREFIX}:${s}`;
}

// Fetch an icon SVG, using a disk cache to avoid repeated API calls.
// Cache layout: _build/cache/iconify/{prefix}/{name}.svg
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

// Walk the AST depth-first, calling fn on every node.
function walk(node, fn) {
  fn(node);
  if (node.children) node.children.forEach((c) => walk(c, fn));
}

const plugin = {
  name: 'Iconify Icons',
  roles: [
    {
      name: 'icon',
      doc: 'Inline icon from Iconify (e.g. {icon}`mdi:home` or {icon}`home`).',
      body: { type: String, required: true },
      run(data) {
        // Emit a placeholder — the transform will resolve it to an actual image.
        return [{ type: 'iconifyPlaceholder', key: normalize(data.body) }];
      },
    },
  ],
  transforms: [
    {
      name: 'iconify-resolve',
      stage: 'document',
      plugin: () => async (tree) => {
        // Collect all placeholder nodes in this document.
        const nodes = [];
        walk(tree, (node) => {
          if (node.type === 'iconifyPlaceholder') nodes.push(node);
        });
        if (!nodes.length) return;

        // Fetch each unique icon once (cache hits are instant).
        const keys = [...new Set(nodes.map((n) => n.key))];
        const svgs = {};
        await Promise.all(keys.map(async (k) => { svgs[k] = await fetchIcon(k); }));

        // Replace each placeholder in-place (clear old keys, assign new ones).
        for (const node of nodes) {
          const { key } = node;
          const svg = svgs[key];
          Object.keys(node).forEach((k) => delete node[k]);
          if (!svg) {
            Object.assign(node, { type: 'text', value: `[${key}]` });
          } else {
            const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
            Object.assign(node, {
              type: 'image',
              url: dataUri,
              alt: key,
              class: 'iconify-icon',
              style: { display: 'inline', verticalAlign: 'middle', width: '1.2em', height: '1.2em' },
            });
          }
        }
      },
    },
  ],
};

export default plugin;
