const { merge } = require('webpack-merge');
const base = require('./webpack.config.base');

process.env.NODE_ENV = 'development'; // 通过这个控制 css 适配 生产/测试

module.exports = merge(base, {
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
          {
            test: /\.less$/,
            use: ['style-loader', 'css-loader', 'less-loader'],
          },
        ],
      },
    ],
  },
  devServer: {
    compress: true,
    port: 8081,
    open: true,
    hot: true,
  },
});
