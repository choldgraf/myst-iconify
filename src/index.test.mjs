import { describe, it, expect, vi } from 'vitest';
import plugin from './index.mjs';

const role = plugin.roles[0];
const transform = plugin.transforms[0];

// Minimal mock of MyST's utils.selectAll - filters nodes by type from a tree.
function selectAll(type, tree) {
  const results = [];
  (function walk(node) {
    if (node.type === type) results.push(node);
    if (node.children) node.children.forEach(walk);
  })(tree);
  return results;
}
const utils = { selectAll };

// Helper to extract the base64 SVG from a span node's backgroundImage style
function decodeSvg(node) {
  const match = node.style.backgroundImage.match(/base64,(.+?)"/);
  return Buffer.from(match[1], 'base64').toString();
}

describe('icon role', () => {
  it('parses prefix:name format', () => {
    const [node] = role.run({ body: 'fa6-solid:gear' });
    expect(node.key).toBe('fa6-solid:gear');
  });

  it('defaults to mdi prefix when no colon', () => {
    const [node] = role.run({ body: 'home' });
    expect(node.key).toBe('mdi:home');
  });

  it('trims whitespace', () => {
    const [node] = role.run({ body: '  mdi:home  ' });
    expect(node.key).toBe('mdi:home');
  });

  it('passes color option to placeholder', () => {
    const [node] = role.run({ body: 'mdi:home', options: { color: 'red' } });
    expect(node.color).toBe('red');
  });
});

describe('iconify-resolve transform', () => {
  it('replaces placeholder with span node on success', async () => {
    const tree = {
      type: 'root',
      children: [{ type: 'iconifyPlaceholder', key: 'mdi:home' }],
    };
    await transform.plugin(null, utils)(tree);
    const node = tree.children[0];
    expect(node.type).toBe('span');
    expect(node.style.backgroundImage).toMatch(/data:image\/svg\+xml;base64,/);
  });

  it('falls back to text and warns for invalid icon', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const tree = {
      type: 'root',
      children: [{ type: 'iconifyPlaceholder', key: 'mdi:this-icon-does-not-exist-xyz' }],
    };
    await transform.plugin(null, utils)(tree);
    const node = tree.children[0];
    expect(node.type).toBe('text');
    expect(node.value).toBe('[mdi:this-icon-does-not-exist-xyz]');
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('could not fetch icon "mdi:this-icon-does-not-exist-xyz"'),
    );
    warn.mockRestore();
  });

  it('applies color to SVG when specified', async () => {
    const tree = {
      type: 'root',
      children: [{ type: 'iconifyPlaceholder', key: 'mdi:home', color: 'red' }],
    };
    await transform.plugin(null, utils)(tree);
    const node = tree.children[0];
    expect(node.type).toBe('span');
    const svg = decodeSvg(node);
    expect(svg).toContain('red');
    expect(svg).not.toContain('currentColor');
  });

  it('skips trees with no placeholders', async () => {
    const tree = {
      type: 'root',
      children: [{ type: 'text', value: 'hello' }],
    };
    await transform.plugin(null, utils)(tree);
    expect(tree.children[0].type).toBe('text');
    expect(tree.children[0].value).toBe('hello');
  });
});
