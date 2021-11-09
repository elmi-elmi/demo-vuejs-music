<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <AppUpload ref="upload" />
      </div>
      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col"
        >
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i
              class="fa fa-compact-disc float-right text-green-400 text-2xl"
            ></i>
          </div>
          <div class="p-6">
            <CompositionItem
              v-for="(song,indx) in songs"
              :key="song.documentID"
              :song="song"
              :updateSong="updateSong"
              :index="indx"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// import store from '@/store';
import {
  collection, query, where, getDocs,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import AppUpload from '@/components/Upload.vue';
import CompositionItem from '@/components/CompositionItem.vue';

import { db } from '@/includes/firebase';

export default {
  components: { AppUpload, CompositionItem },
  name: 'Manage',
  data() {
    return { songs: [] };
  },
  beforeRouteLeave(to, from, next) {
    this.$refs.upload.cancelUploads();
    next();
  },
  async created() {
    const auth = getAuth();
    const q = query(collection(db, 'songs'), where('uid', '==', auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const song = { ...doc.data(), documentID: doc.id };
      this.songs.push(song);
    });
  },
  methods: {
    updateSong(values, index) {
      this.songs[index].modified_name = values.modified_name;
      this.songs[index].genre = values.genre;
    },
  },
  // beforeRouteEnter(to, from, next) {
  //   if (store.state.userLoggedIn) {
  //     next();
  //   } else {
  //     next({ name: 'Home' });
  //   }
  // },
};
</script>
