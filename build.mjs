// Build script for bundling the Iconify plugin
import * as esbuild from 'esbuild';
import { mkdirSync } from 'fs';

mkdirSync('dist', { recursive: true });

await esbuild.build({
  entryPoints: ['src/index.mjs'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: 'dist/index.mjs',
  minify: false,
  external: ['crypto', 'fs', 'path'],
  banner: {
    js: `// Iconify Plugin for MyST
// Bundled version - see https://github.com/jupyter-book/myst-iconify
// Generated: ${new Date().toISOString()}
`
  }
});

console.log('Plugin bundled successfully to dist/index.mjs');
