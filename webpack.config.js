module.exports = {
  entry: './index.js',
  output: {
    filename: 'browser.js',
    path: '.',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },
  devtool: 'eval-source-map',
};
