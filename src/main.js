import { createApp } from 'vue';
import { getAuth } from 'firebase/auth';
import { onAuthStateChanged } from './includes/firebase';
import App from './App.vue';
import router from './router';
import store from './store/index';
import './assets/tailwind.css';
import './assets/main.css';
import veeValidationPlugin from './includes/validation';
import Icon from './directives/icon';
import i18n from './includes/i18n';
import './registerServiceWorker';
import GlobalsComponents from './includes/_globals';
import ProgressBar from './includes/progress-bar';
import 'nprogress/nprogress.css';

ProgressBar(router);

let app;

onAuthStateChanged(getAuth(), () => {
  if (!app) {
    app = createApp(App);
    app.use(i18n);
    app.use(store);
    app.use(router);
    app.use(veeValidationPlugin);
    app.use(GlobalsComponents);
    app.directive('icon', Icon);
    app.mount('#app');
  }
});
