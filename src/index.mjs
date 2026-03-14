// Iconify Plugin for MyST
// Usage: {icon}`mdi:home` or {icon}`home` (defaults to mdi prefix)
// Browse icons at https://icon-sets.iconify.design

import { createHash } from 'crypto';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const ICONIFY_API = 'https://api.iconify.design';
const DEFAULT_PREFIX = 'mdi';
const CACHE_DIR = '_build/cache/iconify';

function cachePathFor(key) {
  return join(CACHE_DIR, createHash('md5').update(key).digest('hex') + '.svg');
}

function normalize(raw) {
  const s = raw.trim();
  return s.includes(':') ? s : `${DEFAULT_PREFIX}:${s}`;
}

async function fetchIcon(key) {
  const path = cachePathFor(key);
  if (existsSync(path)) return readFileSync(path, 'utf8');
  const [prefix, name] = key.split(':');
  try {
    const res = await fetch(`${ICONIFY_API}/${prefix}/${name}.svg`);
    if (!res.ok) return null;
    const svg = await res.text();
    mkdirSync(CACHE_DIR, { recursive: true });
    writeFileSync(path, svg);
    return svg;
  } catch {
    return null;
  }
}

function walk(node, callback) {
  callback(node);
  if (node.children) node.children.forEach((c) => walk(c, callback));
}

const plugin = {
  name: 'Iconify Icons',
  roles: [
    {
      name: 'icon',
      doc: 'Inline icon from Iconify (e.g. {icon}`mdi:home` or {icon}`home`).',
      body: { type: String, required: true },
      run(data) {
        return [{ type: 'iconifyPlaceholder', key: normalize(data.body) }];
      },
    },
  ],
  transforms: [
    {
      name: 'iconify-resolve',
      stage: 'document',
      plugin: () => async (tree) => {
        const nodes = [];
        walk(tree, (node) => {
          if (node.type === 'iconifyPlaceholder') nodes.push(node);
        });
        if (!nodes.length) return;

        const keys = [...new Set(nodes.map((n) => n.key))];
        const svgs = {};
        await Promise.all(keys.map(async (k) => { svgs[k] = await fetchIcon(k); }));

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
