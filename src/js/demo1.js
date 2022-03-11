import { createApp } from 'vue';
import $ from 'jquery';

const fun = () => {
  console.log('demo2', $);
  console.log('demo2', createApp);
};

export default { fun };
