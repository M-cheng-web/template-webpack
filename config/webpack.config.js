const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

process.env.NODE_ENV = 'development'; // 通过这个控制 css 适配 生产/测试

// css & less 复用loader
const commonCssLoader = [
  MiniCssExtractPlugin.loader, // 会取代 style-loader, 可以将 css 提取出为单独文件
  'css-loader',
  {
    loader: 'postcss-loader', // css 适配
    options: {
      postcssOptions: {
        plugins: ['postcss-preset-env'],
      },
    },
  },
];

module.exports = {
  mode: process.env.NODE_ENV, // production/development 生产环境会自动压缩js代码 自动压缩html代码
  entry: './src/js/index.js',
  output: {
    filename: 'js/[name].[contenthash:10].js',
    path: resolve(__dirname, 'build'),
  },
  devtool: process.env.NODE_ENV === 'development' ? 'eval-source-map' : 'source-map',
  // externals: { // 选定某些第三方库不打包
  //   jquery: 'jQuery',
  // },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.css$/,
            use: [...commonCssLoader],
          },
          {
            test: /\.less$/,
            use: [...commonCssLoader, 'less-loader'],
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
            test: /\.html$/,
            loader: 'html-loader',
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'thread-loader',
                options: {
                  workers: 6, // 进程2个
                },
              },
              {
                loader: 'babel-loader',
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        useBuiltIns: 'usage', // 按需加载
                        corejs: { version: 3 }, // 指定 corejs 版本
                        targets: { // 指定兼容性做到哪个版本浏览器
                          chrome: '60',
                          firefox: '60',
                          ie: '9',
                          safari: '10',
                          edge: '17',
                        },
                      },
                    ],
                  ],
                  cacheDirectory: true, // 第二次构建时,会读取之前的缓存
                },
              },
            ],
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
      minify: { // mode = production 会移除空格和注释
        collapseWhitespace: true, // 移除空格
        removeComments: true, // 移除注释
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'css/built.[contenthash:10].css',
    }),
    new OptimizeCssAssetsWebpackPlugin(), // 压缩 css 代码
    new ESLintPlugin(), // eslint 检查
  ],
  devServer: {
    compress: true,
    port: 8081,
    open: true,
    hot: true,
  },
  optimization: { // 项目代码和第三方库代码剥离(多入口模式中会将公共包提取出)
    splitChunks: {
      chunks: 'all',
    },
  },
};
