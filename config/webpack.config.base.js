const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/[name].[contenthash:10].js',
    path: resolve(__dirname, 'build'),
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
      // mode = production 会自动移除空格和注释, 开发环境又不需要移除,所以下面段不需要
      // minify: {
      //   collapseWhitespace: true, // 移除空格
      //   removeComments: true, // 移除注释
      // },
    }),
    new ESLintPlugin(), // eslint 检查
  ],
};
