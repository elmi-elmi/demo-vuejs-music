import { createStore } from 'vuex';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { db, auth } from '@/includes/firebase';

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
  },
});
