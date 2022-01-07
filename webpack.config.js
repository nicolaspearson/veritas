const { WebpackPnpExternals } = require('webpack-pnp-externals');

const webpackConfig = require('./webpack.util');

module.exports = webpackConfig({
  bundleFilename: 'index.js',
  cwd: __dirname,
  entry: ['./src/index.ts'],
  externals: [WebpackPnpExternals()],
  plugins: [],
  production: true,
});
