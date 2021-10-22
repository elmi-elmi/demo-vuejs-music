import { createApp } from 'vue';
import './includes/firebase';
import App from './App.vue';
import router from './router';
import store from './store/index';
import './assets/tailwind.css';
import './assets/main.css';
import veeValidationPlugin from './includes/validation';

const app = createApp(App);
app.use(store);
app.use(router);
app.use(veeValidationPlugin, { foo: 5 });
app.mount('#app');
