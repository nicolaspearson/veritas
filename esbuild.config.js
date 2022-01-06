const esbuild = require('esbuild');

const { pnpPlugin } = require('@yarnpkg/esbuild-plugin-pnp');

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/index.js',
    bundle: true,
    minify: true,
    platform: 'node',
    sourcemap: true,
    target: 'node14',
    plugins: [pnpPlugin()],
  })
  .catch(() => process.exit(1));
