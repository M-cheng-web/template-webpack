const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const defineProps = require('./define-properties');

module.exports = {
  mode: process.env.NODE_ENV, // production/development 生产环境会自动压缩js代码 自动压缩html代码
  devtool: process.env.NODE_ENV === 'development' ? 'eval-source-map' : false,
  entry: './src/js/index.js',
  output: {
    filename: 'js/[name].[contenthash:10].js',
    path: resolve(__dirname, '../build'),
  },
  // externals: { // 选定某些第三方库不打包
  //   jquery: 'jQuery',
  // },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.html$/,
            loader: 'html-loader',
          },
          {
            test: /\.(jpg|png|gif)$/,
            loader: 'url-loader',
            options: {
              limit: 30 * 1024, // 小于这个的用 url-loader 大于就用 file-loader
              esModule: false,
              name: '[hash:10].[ext]',
              outputPath: 'imgs',
            },
            type: 'javascript/auto',
          },
          {
            exclude: /\.(html|js|css|less|jpg|png|gif)/,
            loader: 'file-loader',
            options: {
              name: '[hash:10].[ext]',
              outputPath: 'media',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new ESLintPlugin(), // eslint 检查
    new webpack.DefinePlugin({ // 默认用 development 的数据
      'process.env': JSON.stringify(defineProps[process.env.BUILD_ENV] || defineProps.development),
    }),
  ],
};
