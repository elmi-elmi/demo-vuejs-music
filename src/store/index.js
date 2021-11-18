import { createStore } from 'vuex';
import {
  createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, getAuth,
} from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { Howl } from 'howler';
import { db } from '@/includes/firebase';

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
    currenSong: {},
    sound: {},

  },
  mutations: {
    authModalToggle(state) {
      state.authModalShow = !state.authModalShow;
    },
    authToggle(state) {
      state.userLoggedIn = !state.userLoggedIn;
    },
    newSong(state, payload) {
      state.currenSong = payload;
      state.sound = new Howl({
        src: [payload.url],
        html5: true,
      });
    },
  },
  getters: {
    authModalShow(state) {
      return state.authModalShow;
    },
    playing(state) {
      if (state.sound.playing) {
        return state.sound.playing();
      }

      return false;
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

      await updateProfile(userCred.user, { displayName: payload.name })
        .then(() => console.log('register done.'));

      commit('authToggle');
    },
    intit_login({ commit }) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
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
    async newSong({ commit, state }, payload) {
      console.log('new song play....');
      commit('newSong', payload);
      state.sound.play();
    },
    async toggleAudio({ state }) {
      if (!state.sound.playing) {
        return;
      }

      if (state.sound.playing()) {
        state.sound.pause();
      } else {
        state.sound.play();
      }
    },
  },
});
