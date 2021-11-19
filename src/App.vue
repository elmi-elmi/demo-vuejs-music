<template>
  <app-header></app-header>

  <router-view v-slot="{Component}">
    <transition name='fade' mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>

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

<style scoped>
.fade-enter-from{
  opacity:0;
}

.fade-enter-active{
  transition: all 0.5s linear;
}

.fade-leave-tp{
  transition: all 0.5s linear;
  opacity:0;
}
</style>
