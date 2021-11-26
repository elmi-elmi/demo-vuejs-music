import { createStore } from 'vuex';
// import auth from './modules/auth';
// import player from './modules/player';
import modules from './modules/index';

export default createStore({
  modules,
});
