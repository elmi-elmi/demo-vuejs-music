<template>
  <!-- Introduction -->
  <section class="mb-8 py-20 text-white text-center relative">
    <!-- <div
      class="absolute inset-0 w-full h-full bg-contain introduction-bg"
      style="background-image: url(assets/img/header.png)"
    ></div> -->
    <div class="container mx-auto">
      <div class="text-white main-header-content">
        <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
        <p class="w-full md:w-8/12 mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et
          dolor mollis, congue augue non, venenatis elit. Nunc justo eros,
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
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title">Songs</span>
        <i class="fa fa-headphones-alt float-right text-green-400 text-2xl"></i>
      </div>
      <!-- Playlist -->
      <ol id="playlist">
        <SongItem v-for="song in songs" :song="song" :key="song.documentID" />
      </ol>
      <!-- .. end Playlist -->
    </div>
  </section>
</template>

<script>
import { getDocs, collection } from 'firebase/firestore';
import SongItem from '@/components/SongItem.vue';
import { db } from '@/includes/firebase';

export default {
  name: 'Home',
  components: { SongItem },
  data() { return { songs: [] }; },
  async created() {
    const songsCollection = collection(db, 'songs');
    const songsSnapshot = await getDocs(songsCollection);

    songsSnapshot.forEach((doc) => {
      console.log('from songssnapshot ***** ');
      const song = {
        documentID: doc.id,
        ...doc.data(),
      };
      this.songs.push(song);
    });
  },
};
</script>
