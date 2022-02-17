const fs = require('fs');
const { resolve } = require('path');
const properties = require('properties');

const envObj = {};
const fileNames = fs.readdirSync(resolve(__dirname));
fileNames.forEach((file) => {
  if (file) {
    const arr = file.match(/^.env.(.*)/);
    if (arr && arr[1]) {
      const propsString = fs.readFileSync(resolve(__dirname, `./${file}`), 'utf-8');
      envObj[arr[1]] = properties.parse(propsString);
    }
  }
});

// 生成的对象类似于这样的
/**
 * envObj {
    development: {
      VUE_APP_BASE_URL_ORG: '/wit-web',
      VUE_APP_IMG: 'http://172.15.8.215:33199'
    },
    production: {
      VUE_APP_BASE_URL_ORG: '/wit-web',
      VUE_APP_IMG: 'http://172.40.1.112:12001'
    },
    test: { uuurrl: 'production' }
  }
 */

module.exports = envObj;
