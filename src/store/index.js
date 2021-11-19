import { createStore } from 'vuex';
import {
  createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, getAuth,
} from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { Howl } from 'howler';
import { db } from '@/includes/firebase';
import helper from '@/includes/helper';

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%',

  },
  mutations: {
    authModalToggle(state) {
      state.authModalShow = !state.authModalShow;
    },
    authToggle(state) {
      state.userLoggedIn = !state.userLoggedIn;
    },
    newSong(state, payload) {
      state.currentSong = payload;
      state.sound = new Howl({
        src: [payload.url],
        html5: true,
      });
    },
    updatePosition(state) {
      state.seek = helper.formatTime(state.sound.seek());
      state.duration = helper.formatTime(state.sound.duration());
      state.playerProgress = `${(state.sound.seek() / state.sound.duration()) * 100}%`;
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
    async newSong({ commit, state, dispatch }, payload) {
      if (state.sound instanceof Howl) {
        state.sound.unload();
      }
      console.log('new song play....');
      commit('newSong', payload);
      state.sound.play();

      state.sound.on('play', () => { requestAnimationFrame(() => { dispatch('progress'); }); });
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
    progress({ state, dispatch, commit }) {
      commit('updatePosition');

      if (state.sound.playing()) {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      }
    },
    updateSeek({ state, dispatch }, payload) {
      if (!state.sound.playing) {
        return;
      }
      const { x, width } = payload.currentTarget.getBoundingClientRect();

      const clickX = payload.clientX - x;
      const persentage = clickX / width;
      const seconds = state.sound.duration() * persentage;
      state.sound.seek(seconds);

      state.sound.once('seek', () => { dispatch('progress'); });
    },
  },
});
