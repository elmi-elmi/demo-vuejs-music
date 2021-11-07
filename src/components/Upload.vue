<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <div
        class="
          w-full
          px-10
          py-20
          rounded
          text-center
          cursor-pointer
          border border-dashed border-gray-400
          text-gray-400
          transition
          duration-500
          hover:text-white
          hover:bg-green-400
          hover:border-green-400
          hover:border-solid
        "
        :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple @change="upload($event)" />
      <hr class="my-6" />
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="upload.icon"></i>{{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: upload.currentProgress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL } from 'firebase/storage';
import {
  db, storage, ref, uploadBytesResumable,
} from '@/includes/firebase';

export default {
  name: 'Upload',
  data() {
    return { is_dragover: false, uploads: [] };
  },
  methods: {
    upload($event) {
      this.is_dragover = false;
      // console.log($event.dataTransfer.files);
      const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files];
      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') {
          console.log('*********return ***', file.type);
          return;
        }
        const songRef = ref(storage, `songs/${file.name}`);
        const uploadTask = uploadBytesResumable(songRef, file);
        const uploadIndex = this.uploads.push({
          uploadTask,
          currentProgress: 0,
          name: file.name,
          variant: 'bg-blue-400',
          icon: 'fas fa-spinner fa-spin',
          text_class: 'text-blue-400',
        }) - 1;

        uploadTask.on(
          'state-changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.uploads[uploadIndex].currentProgress = progress;
          },
          (error) => {
            this.uploads[uploadIndex].variant = 'bg-red-400';
            this.uploads[uploadIndex].icon = 'fas fa-times';
            this.uploads[uploadIndex].text_class = 'text-red-400';
            console.log(error);
          },
          async () => {
            const auth = getAuth();
            const song = {
              uid: auth.currentUser.uid,
              // display_name: auth.currentUser.name,
              original_name: uploadTask.snapshot.ref.name,
              modified_name: uploadTask.snapshot.ref.name,
              genre: '',
              comment_count: 0,
            };

            song.url = await getDownloadURL(uploadTask.snapshot.ref);
            await addDoc(collection(db, 'songs'), song);
            this.uploads[uploadIndex].text_class = 'text-green-400';
            this.uploads[uploadIndex].variant = 'bg-green-400';
            this.uploads[uploadIndex].icon = 'fas fa-check';
          },
        );
        console.log('end------------------');
      });
    },
    cancelUploads() {
      this.uploads.forEach((upload) => {
        upload.uploadTask.cancel();
      });
    },
  },
  // beforeUnmount() {
  //   console.log('=======unmounted 1========');
  //   this.uploads.forEach((upload) => {
  //     console.log('=======unmounted 2========');
  //     console.log(upload.uploadTask);
  //     upload.uploaTask.cancel();
  //   });
  // },
  // beforeUnmount() {
  //   this.uploads.forEach((upload) => {
  //     upload.task.cancel();
  //   });
  // },
};
</script>
