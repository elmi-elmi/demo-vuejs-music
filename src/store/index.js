import { createStore } from 'vuex';

export default createStore({
  state: {
    authModalShow: false,
  },
  mutations: {
    authModalToggl(state) {
      state.authModalShow = !state.authModalShow;
    }
  },
  // actions: {
  // },
  // modules: {
  // },
});
