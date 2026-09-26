import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { reveal } from './directives/reveal'
import { tilt } from './directives/tilt'
import { installUiSounds, playSfx } from './audio/sfx'

installUiSounds()
router.afterEach((to, from) => {
  if (from.matched.length && to.path !== from.path) playSfx('page')
})

createApp(App).use(router).directive('reveal', reveal).directive('tilt', tilt).mount('#app')
