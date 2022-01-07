const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
const { WebpackPnpExternals } = require('webpack-pnp-externals');
const webpack = require('webpack');

const webpackConfig = require('./webpack.util');

module.exports = () => {
  return webpackConfig({
    bundleFilename: 'dev-index.js',
    cwd: __dirname,
    entry: ['webpack/hot/poll?100', './src/index.ts'],
    externals: [
      WebpackPnpExternals({
        exclude: ['webpack/hot/poll?100'],
      }),
    ],
    plugins: [
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/],
      }),
      new webpack.HotModuleReplacementPlugin(),
      new RunScriptWebpackPlugin({ name: 'dev-index.js' }),
    ],
    production: false,
  });
};
