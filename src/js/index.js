import '../css/index.css';
import '../css/index.less';
import { createApp } from 'vue';
import $ from 'jquery';
import Demo1 from './demo1';
import Demo2 from './demo2';

console.log('demo1', Demo1.fun());
console.log('demo2', Demo2.fun());

console.log('createApp', $);
console.log('createApp', createApp);

console.log('process.env.BBB', process.env.BBB);

console.log('process.env.VUE_APP_IMG', process.env.VUE_APP_IMG);
