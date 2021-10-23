import { createStore } from 'vuex';

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
  },
  mutations: {
    authModalToggle(state) {
      state.authModalShow = !state.authModalShow;
    },
    authToggle(state) {
      state.userLoggedIn = !state.userLoggedIn;
    },
  },
  getters: {
    authModalShow(state) {
      return state.authModalShow;
    },
  },
  // actions: {
  // },
  // modules: {
  // },
});
