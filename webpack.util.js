const path = require('path');

module.exports = ({ bundleFilename, cwd, entry, externals, plugins, production }) => ({
  externals,
  entry: entry ? entry : ['./src/index.ts'],
  mode: production ? 'production' : 'development', // Sets NODE_ENV
  module: {
    rules: [
      {
        test: /\.ts$/i,
        loader: 'ts-loader',
        options: {
          configFile: path.join(cwd, 'tsconfig.build.json'),
        },
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  output: {
    path: path.join(cwd, 'dist'),
    filename: bundleFilename ? bundleFilename : 'index.js',
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts'],
  },
  target: 'node',
});
