const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const { merge } = require('webpack-merge');
const base = require('./webpack.config.base');

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

process.env.NODE_ENV = 'production'; // 通过这个控制 css 适配 生产/测试

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

module.exports = merge(base, {
  mode: process.env.NODE_ENV, // production/development 生产环境会自动压缩js代码 自动压缩html代码
  devtool: process.env.NODE_ENV === 'development' ? 'eval-source-map' : false,
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
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'thread-loader',
                options: {
                  workers: 4, // 进程4个
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
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/built.[contenthash:10].css',
    }),
    new OptimizeCssAssetsWebpackPlugin(), // 压缩 css 代码
  ],
  optimization: { // 项目代码和第三方库代码剥离(多入口模式中会将公共包提取出)
    splitChunks: {
      chunks: 'all',
    },
  },
});
