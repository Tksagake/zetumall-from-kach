const path = require('path');

module.exports = {
  mode: 'development', // Set the mode to 'development' or 'production'
  entry: './api/index.js', // Adjust the entry point as needed
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
};
