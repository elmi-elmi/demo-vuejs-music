<template>
  <main>
    <base-button/>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <!-- <div
      class="absolute inset-0 w-full h-full bg-contain introduction-bg"
      style="background-image: url(assets/img/header.png)"
    ></div> -->
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">{{$t('home.listen')}}</h1>
          <p class="w-full md:w-8/12 mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            et dolor mollis, congue augue non, venenatis elit. Nunc justo eros,
            suscipit ac aliquet imperdiet, venenatis et sapien. Duis sed magna
            pulvinar, fringilla lorem eget, ullamcorper urna.
          </p>
        </div>
      </div>
      <!-- <img
      class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
      src="assets/img/introduction-music.png"
    /> -->
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
          v-icon-secondary="{icon:'headphones-alt', right:true}"
        >
          <span class="card-title">Songs</span>
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <SongItem v-for="song in songs" :song="song" :key="song.documentID" />
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>

<script>
import {
  getDocs,
  collection,
  query,
  limit,
  orderBy,
  startAfter,
  doc,
  getDoc,
} from 'firebase/firestore';
import SongItem from '@/components/SongItem.vue';
import { db } from '@/includes/firebase';
import IconSecondary from '@/directives/icon-secondary';

export default {
  name: 'Home',
  components: { SongItem },
  directives: { IconSecondary },
  data() {
    return { songs: [], maxPerPage: 10, pendingRequest: false };
  },
  async created() {
    this.getSongs();
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    async handleScroll() {
      const { offsetHeight, scrollTop } = document.documentElement;
      const { innerHeight } = window;

      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

      if (bottomOfWindow) {
        console.log('bottom of window');
        this.getSongs();
      }
    },
    async getSongs() {
      if (this.pendingRequest) {
        return;
      }
      this.pendingRequest = true;
      const songsCollection = collection(db, 'songs');

      // Query the first

      let songsSnapshot;
      if (this.songs.length) {
        const lastSongRef = doc(
          db,
          'songs',
          this.songs[this.songs.length - 1].documentID,
        );
        const lastSong = await getDoc(lastSongRef);

        const nextSongsRef = query(
          songsCollection,
          orderBy('modified_name'),
          startAfter(lastSong),
          limit(this.maxPerPage),
        );
        songsSnapshot = await getDocs(nextSongsRef);
      } else {
        const q = query(
          songsCollection,
          orderBy('modified_name'),
          limit(this.maxPerPage),
        );
        songsSnapshot = await getDocs(q);
      }

      songsSnapshot.forEach((document) => {
        const song = {
          documentID: document.id,
          ...document.data(),
        };
        this.songs.push(song);
      });

      this.pendingRequest = false;
    },
  },
};
</script>
