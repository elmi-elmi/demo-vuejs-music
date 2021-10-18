import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index.js';
import './assets/tailwind.css';
import './assets/main.css';
import veevalidationPlugin from './includes/validation.js';

const app = createApp(App);
app.use(store);
app.use(router);
app.use(veevalidationPlugin, { foo: 5 });
app.mount('#app');
