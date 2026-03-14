import { describe, it, expect } from 'vitest';

// Import the plugin to test its role and transform
import plugin from './index.mjs';

const role = plugin.roles[0];
const transform = plugin.transforms[0];

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
    const fn = transform.plugin();
    await fn(tree);
    const node = tree.children[0];
    expect(node.type).toBe('image');
    expect(node.url).toMatch(/^data:image\/svg\+xml;base64,/);
    expect(node.alt).toBe('mdi:home');
  });

  it('falls back to text for invalid icon', async () => {
    const tree = {
      type: 'root',
      children: [{ type: 'iconifyPlaceholder', key: 'mdi:this-icon-does-not-exist-xyz' }],
    };
    const fn = transform.plugin();
    await fn(tree);
    const node = tree.children[0];
    expect(node.type).toBe('text');
    expect(node.value).toBe('[mdi:this-icon-does-not-exist-xyz]');
  });

  it('skips trees with no placeholders', async () => {
    const tree = {
      type: 'root',
      children: [{ type: 'text', value: 'hello' }],
    };
    const fn = transform.plugin();
    await fn(tree);
    expect(tree.children[0].type).toBe('text');
    expect(tree.children[0].value).toBe('hello');
  });
});
