import '../css/index.css';
import '../css/index.less';
import { createApp } from 'vue';
import $ from 'jquery';
import { get1 } from './demo';

console.log('createApp', $);
console.log('createApp', createApp);

get1();

const a = () => {
  console.log('我是A');
};

a();

const b = new Promise((res) => {
  res(123);
}).then((res) => {
  console.log('res', res);
});

console.log('b', b);

console.log('process.env.NODE_ENV', process.env.NODE_ENV);
