const webpack = require('webpack');
const path = require('path');
module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
      'whatwg-fetch','./src/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  resolve: {
    extensions: ['.js']
  },
  devServer: {
    port: 3000,
    hot:true,
    disableHostCheck:true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
     rules: [
       {
          test: /\.css$/,
          use: ['style-loader', 'css-loader','postcss-loader']
       },
       {
           test: /\.(png|jpg|gif)$/,
           use: [
             {
                loader: 'file-loader',
                options: {}
             }
           ]
       },
       {
           test: /\.js$/,
           exclude: /\/node_modules\//,
           use: ['babel-loader']
       }
     ]
  }
};
