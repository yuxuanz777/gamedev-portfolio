import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const titlePrefix = 'Seven Zhang VII'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: { immersive: true, title: 'HOME' }
  },
  {
    path: '/resume',
    name: 'Resume',
    component: () => import(/* webpackChunkName: "about" */ '../views/Resume.vue'),
    meta: { title: 'RESUME' }
  },
  {
    path: '/game-projects',
    name: 'Game Projects',
    component: () => import(/* webpackChunkName: "about" */ '../views/GameProjects.vue'),
    meta: { title: 'GAME PROJECTS' }
  },
  {
    path: '/other-projects',
    name: 'Other Projects',
    component: () => import(/* webpackChunkName: "about" */ '../views/OtherProjects.vue'),
    meta: { title: 'OTHER PROJECTS' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import(/* webpackChunkName: "about" */ '../views/Contact.vue'),
    meta: { title: 'CONTACT' }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "about" */ '../views/404.vue'),
    meta: { title: 'NOT FOUND' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

if (import.meta.env.DEV || import.meta.env.MODE === 'design-lab') {
  routes.splice(routes.length - 1, 0, {
    path: '/design-lab',
    name: 'Design Lab',
    component: () => import('../views/DesignLab.vue'),
    meta: { immersive: true, title: 'DESIGN LAB' }
  })
}

const legacyHashPath = window.location.hash.slice(1)

if (legacyHashPath.startsWith('/')) {
  window.history.replaceState(window.history.state, '', legacyHashPath)
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.afterEach((to) => {
  document.title = `${titlePrefix} ${String(to.meta.title ?? 'HOME')}`
})

export default router
