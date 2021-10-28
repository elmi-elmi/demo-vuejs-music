import { createStore } from 'vuex';
import {
  createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, getAuth,
} from 'firebase/auth';

import { setDoc, doc } from 'firebase/firestore';

import { db } from '@/includes/firebase';

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
  actions: {
    async register({ commit }, payload) {
      const auth = getAuth();
      const userCred = await createUserWithEmailAndPassword(auth, payload.email, payload.password);

      await setDoc(doc(db, 'users', userCred.user.uid), {
        name: payload.name,
        age: payload.age,
        country: payload.country,
        email: payload.email,
      });

      await updateProfile(userCred.user, { displayName: payload.name });

      commit('authToggle');
    },
    intit_login({ commit }) {
      const auth = getAuth();
      const user = auth.currentUser;
      console.log('In th init_login', user);
      if (user) {
        console.log('init_lgin active');
        commit('authToggle');
      }
    },
    async login({ commit }, payload) {
      const auth = getAuth();

      await signInWithEmailAndPassword(auth, payload.email, payload.password);
      commit('authToggle');
    },
    async signout({ commit }) {
      await getAuth().signOut();
      commit('authToggle');
    },
  },
});
