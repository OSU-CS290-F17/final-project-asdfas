const path = require('path');

module.exports = {
  entry: './javascript/src/application.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/dist')
  },
  devServer: {
    contentBase: __dirname + '/public/'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.handlebars$/, loader: 'handlebars-loader' }
    ]
  }
}
