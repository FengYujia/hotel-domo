import './assets/main.css';
import Antd from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import 'echarts';
import ECharts from 'vue-echarts';


const app = createApp(App);

app.component('VueEcharts', ECharts);

app.use(Antd);
app.use(router);

app.mount('#app');
