<template>
  <main>
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <button
          @click="newSong(song)"
          type="button"
          class="
            z-50
            h-24
            w-24
            text-3xl
            bg-white
            text-black
            rounded-full
            focus:outline-none
          "
        >
          <i class="fas fa-play"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <div class="text-3xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.genre }}</div>
          <div class="song-price">{{$n(1, 'currency', 'en')}}</div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="container mx-auto mt-6" id="comments">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span class="card-title">{{
            $tc("song.comments", song.comment_count, {
              count: song.comment_count,
            })
          }}</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div
          class="text-center text-white font-bold mp-4 p-4"
          :class="alert_variant"
          v-show="alert_show"
        >
          {{ alert_message }}
        </div>
        <div class="p-6">
          <vee-form
            @submit="addComment"
            :validation-schema="schema"
            v-show="userLoggedIn"
          >
            <vee-field
              name="comment"
              as="textarea"
              class="
                block
                w-full
                py-1.5
                px-3
                text-gray-800
                border border-gray-300
                transition
                duration-500
                focus:outline-none focus:border-black
                rounded
                mb-4
              "
              placeholder="Your comment here..."
            ></vee-field>

            <ErrorMessage name="comment" class="block text-red-600" />
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600"
            >
              Submit
            </button>
          </vee-form>
          <select
            v-model="sort"
            class="
              block
              mt-4
              py-1.5
              px-3
              text-gray-800
              border border-gray-300
              transition
              duration-500
              focus:outline-none focus:border-black
              rounded
            "
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <ul class="container mx-auto">
      <li
        class="p-6 bg-gray-50 border border-gray-200"
        v-for="comment in sortedComments"
        :key="comment.documentID"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>time:{{ comment.datePosted }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>
<script>
import {
  getDoc,
  doc,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { mapState, mapActions } from 'vuex';
import { commentsCollection, songsCollection } from '@/includes/firebase';

export default {
  name: 'Song',
  data() {
    return {
      comments: [],
      song: [],
      schema: {
        comment: 'required|min:3',
      },
      alert_variant: 'bg-blue-500',
      alert_show: false,
      alert_message: 'Adding comment. please wait.',
      in_submission: false,
      sort: '1',
    };
  },
  computed: {
    ...mapState(['userLoggedIn']),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === '1') {
          return new Date(b.datePosted) - new Date(a.datePosted);
        }
        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    },
  },
  async created() {
    // const songRef = doc(db, 'songs', this.$route.params.id);
    const songRef = doc(songsCollection, this.$route.params.id);
    const songSnapshot = await getDoc(songRef);
    if (!songSnapshot.exists()) {
      this.$router.push({ name: 'Home' });
      return;
    }
    this.song = { ...songSnapshot.data(), documentID: songSnapshot.id };
    // console.log('step 2  ------ add comments:');

    const { sort } = this.$route.query;
    this.sort = sort === '1' || sort === '2' ? sort : '1';
    this.getComments();
  },

  methods: {
    ...mapActions(['newSong']),
    async getComments() {
      // const auth = getAuth();
      // console.log(auth.currentUser.displayName);
      const q = query(
        commentsCollection,
        where('sid', '==', this.$route.params.id),
      );
      const commentsSnapshots = await getDocs(q);
      // .then(() => console.log('Gets  comments from firebase storage'))
      // .catch(() => console.log('Something wrong in fetch comments'));

      commentsSnapshots.forEach((comment) => {
        // console.log('comments for this songs:');
        // console.log(comment.data().content);
        this.comments.push({ ...comment.data(), documentID: comment.id });
      });
    },
    async addComment(values, { resetForm }) {
      // console.log('comment is submitted');
      this.alert_variant = 'bg-blue-400';
      this.alert_show = true;
      this.alert_message = 'Adding comment. please wait.';
      this.in_submission = true;
      const auth = getAuth();
      // console.log(auth.currentUser);

      const comment = {
        content: values.comment,
        sid: this.$route.params.id,
        uid: this.song.uid,
        datePosted: new Date().toString(),
        name: auth.currentUser.displayName,
      };

      await addDoc(commentsCollection, comment)
        .then((res) => {
          // console.log('----', res.id);
          this.comments.push({ ...comment, documentID: res.id });
        })
        .catch((err) => {
          this.alert_variant = 'red-red-400';
          this.alert_show = true;
          this.alert_message = 'Something wrong';
          this.in_submission = false;
          console.log('something wrong to add comment', err);
        });

      this.song.comment_count += 1;
      console.log(this.song.documentID);
      console.log(this.$route.params.id);
      const songRef = doc(songsCollection, this.song.documentID);
      await updateDoc(songRef, { comment_count: this.song.comment_count });

      this.alert_variant = 'bg-green-400';
      this.alert_message = 'Adding comment. please wait.';
      this.alert_show = false;
      this.in_submission = false;

      resetForm();
    },
  },
  watch: {
    sort(newValue) {
      if (newValue === this.$route.query.sort) {
        return;
      }
      this.$router.push({
        query: {
          sort: newValue,
        },
      });
    },
  },
};
</script>
