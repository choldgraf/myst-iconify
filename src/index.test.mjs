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
});

describe('iconify-resolve transform', () => {
  it('replaces placeholder with image node on success', async () => {
    const tree = {
      type: 'root',
      children: [{ type: 'iconifyPlaceholder', key: 'mdi:home' }],
    };
    await transform.plugin(null, utils)(tree);
    const node = tree.children[0];
    expect(node.type).toBe('image');
    expect(node.url).toMatch(/^data:image\/svg\+xml;base64,/);
    expect(node.alt).toBe('mdi:home');
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
