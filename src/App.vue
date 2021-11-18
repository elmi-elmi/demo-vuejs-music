<template>
  <app-header></app-header>

  <router-view></router-view>

  <!-- Player -->
  <AppPlayer/>

  <app-modal></app-modal>
</template>

<script>
import AppHeader from './components/Header.vue';
import AppModal from './components/Auth.vue';
import AppPlayer from './components/Player.vue';

export default {
  components: { AppHeader, AppModal, AppPlayer },
  created() {
    this.$store.dispatch('intit_login');
  },
};
</script>
