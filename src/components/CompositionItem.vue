<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="
          ml-1
          py-1
          px-2
          text-sm
          rounded
          text-white
          bg-blue-600
          float-right
        "
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div
      class="text-center font-bold text-white p-4 mb-4"
      :class="variant_alert"
      v-show="showAlert"
    >
      {{ messageAlert }}
    </div>
    <div v-show="showForm">
      <VeeForm
        :validation-schema="schema"
        :initial-values="song"
        @submit="edit"
      >
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <VeeField
            name="modified_name"
            type="text"
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
            "
            placeholder="Enter Song Title"
            @input="updateUnsaveFlag(true)"
          />
          <ErrorMessage name="modified_name" class="text-red-400" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <VeeField
            name="genre"
            type="text"
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
            "
            placeholder="Enter Genre"
            @input="updateUnsaveFlag(true)"
          />
          <ErrorMessage name="genre" class="text-red-400" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          @click="showForm = false"
        >
          Go Back
        </button>
      </VeeForm>
    </div>
  </div>
</template>

<script>
import { updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '@/includes/firebase';

export default {
  name: 'CompositionItem',
  props: {
    song: {
      type: Object,
      require: true,
    },
    updateSong: {
      type: Function,
      require: true,
    },
    index: {
      type: Number,
      require: true,
    },
    removeSong: {
      type: Function,
      require: true,
    },
    updateUnsaveFlag: {
      type: Function,
    },
  },
  data() {
    return {
      showForm: false,
      schema: { modified_name: 'required', genre: 'required' },
      showAlert: false,
      messageAlert: 'updating',
      in_submission: true,
      variant_alert: 'bg-blue-400',
    };
  },
  methods: {
    async deleteSong() {
      const desertRef = ref(storage, `songs/${this.song.original_name}`);
      await deleteObject(desertRef);
      // .then(() => console.log('File Deleted successfully.'))
      // .catch((error) => console.log('In deleteObject something wrong: ', error));

      await deleteDoc(doc(db, 'songs', this.song.documentID));
      // .then(() => console.log('Doc deleted successfully'))
      // .catch((error) => console.log('In deleteDoc something wrong:', error));

      this.removeSong(this.index);
    },
    async edit(values) {
      // console.log('edited');
      this.showAlert = true;
      this.in_submission = false;
      this.variant_alert = 'bg-blue-300';
      this.messageAlert = 'Please wait. Updating song info.';
      // console.log('----ref start -------');
      // console.log(values);
      const songRef = doc(db, 'songs', this.song.documentID);
      // console.log('----ref end -------');

      try {
        // console.log('----try start------');

        await updateDoc(songRef, values);
        // console.log('----try end------');
      } catch (err) {
        // console.log(err);
        this.showAlert = true;
        this.in_submission = false;
        this.variant_alert = 'bg-red-300';
        this.messageAlert = 'Something Wrong!';
        return;
      }
      this.showAlert = true;
      this.in_submission = false;
      this.variant_alert = 'bg-green-300';
      this.messageAlert = 'Success';

      this.updateSong(values, this.index);
      this.updateUnsaveFlag(false);
      this.showAlert = false;
      this.showForm = false;
    },
  },
};
</script>
