import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

// import Home from '@/views/Home.vue';
// import Manage from '@/views/Manage.vue';
// import Song from '@/views/Song.vue';
// import About from '@/views/About.vue';
const Home = () => import('@/views/Home.vue');
const Manage = () => import(/* webpackChunkName: "groupedChunk" */'@/views/Manage.vue');
const Song = () => import(/* webpackChunkName: "groupedChunk" */'@/views/Song.vue');
const About = () => import('@/views/About.vue');

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    component: About,
  },
  {
    path: '/manage-music',
    // alias:'/manage',
    name: 'Manage',
    component: Manage,
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      next();
    },
  },
  {
    path: '/manage',
    redirect: { name: 'Manage' },
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'Home' },
  },
  {
    name: 'Song',
    path: '/song/:id',
    component: Song,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500',
});

router.beforeEach((to, from, next) => {
  if (!to.matched.some((record) => record.meta.requiresAuth)) {
    next();
    return;
  }

  if (store.state.auth.userLoggedIn) {
    next();
  } else {
    next({ name: 'Home' });
  }
});
export default router;
