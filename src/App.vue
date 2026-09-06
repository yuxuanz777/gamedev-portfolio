<template>
  <div id="app" class="app-shell">
    <a v-if="!isImmersive" class="skip-link" href="#main-content">{{ t('common.skip') }}</a>
    <template v-if="!isImmersive">
      <div class="ambient ambient-one" aria-hidden="true"></div>
      <div class="ambient ambient-two" aria-hidden="true"></div>
      <SiteHeader />
    </template>
    <main id="main-content" class="main" :class="{ 'main--immersive': isImmersive }">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <SiteFooter v-if="!isImmersive" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from './components/Header.vue'
import SiteFooter from './components/Footer.vue'
import { useI18n } from './i18n'

const { t } = useI18n()
const route = useRoute()
const isImmersive = computed(() => route.meta.immersive === true)
</script>

<style lang="less">
@import './css/projects.less';
@import './css/variables.less';

:root {
  color-scheme: dark;
  font-synthesis: none;
}

* { box-sizing: border-box; }

html {
  min-width: 320px;
  background: @bodyBgColor;
  scroll-behavior: smooth;
}

body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
  background:
    radial-gradient(circle at 18% 12%, rgba(157, 230, 189, 0.08), transparent 30%),
    radial-gradient(circle at 82% 36%, rgba(226, 189, 114, 0.05), transparent 34%),
    @bodyBgColor;
  color: @textColor;
  font-family: @bodyFont;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: 0.34;
  background-image:
    linear-gradient(rgba(157, 230, 189, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(157, 230, 189, 0.035) 1px, transparent 1px);
  background-size: 52px 52px;
  mask-image: radial-gradient(circle at center, black, transparent 82%);
}

button,
a { -webkit-tap-highlight-color: transparent; }

a {
  color: @goldBright;
  text-decoration: none;
  transition: color 180ms ease, opacity 180ms ease;
}

a:hover { color: #c0f6d5; }

button,
a,
[tabindex] {
  outline-color: @tealGlow;
  outline-offset: 4px;
}

img,
video { max-width: 100%; }

h1,
h2,
h3,
h4,
h5 {
  margin: 0;
  color: @headingColor;
  font-family: @displayFont;
  font-weight: 700;
  line-height: 1.15;
  text-wrap: balance;
}

p { text-wrap: pretty; }

.app-shell {
  position: relative;
  min-height: 100vh;
  overflow: clip;
}

.ambient {
  position: fixed;
  z-index: -1;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
}

.ambient-one {
  top: 18%;
  left: -260px;
  background: rgba(157, 230, 189, 0.08);
}

.ambient-two {
  right: -280px;
  bottom: 12%;
  background: rgba(226, 189, 114, 0.06);
}

.main {
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 250px);
}

.main--immersive {
  min-height: 100vh;
}

.page-shell {
  width: min(@contentWidth, calc(100% - 56px));
  margin: 0 auto;
  padding: 88px 0 40px;
}

.page-heading {
  max-width: 760px;
  margin-bottom: 54px;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  color: @tealGlow;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.eyebrow::before {
  content: '';
  width: 30px;
  height: 1px;
  background: @tealGlow;
  box-shadow: 0 0 12px @tealGlow;
}

.page-title {
  font-size: clamp(2.5rem, 6vw, 5.4rem);
  letter-spacing: -0.035em;
}

.page-lead {
  max-width: 680px;
  margin: 22px 0 0;
  color: @mutedText;
  font-size: clamp(1rem, 1.6vw, 1.18rem);
  line-height: 1.8;
}

.button-primary,
.button-ghost {
  min-height: 48px;
  padding: 0 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 1px solid @tealGlow;
  color: #07100a;
  background: @tealGlow;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 1;
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
}

.button-primary:hover {
  color: #080a08;
  transform: translateY(-2px);
  box-shadow: 0 10px 34px rgba(157, 230, 189, 0.16);
}

.button-ghost {
  border-color: @borderColor;
  color: @tealGlow;
  background: rgba(8, 12, 10, 0.52);
}

.button-ghost:hover {
  color: #c0f6d5;
  border-color: @tealGlow;
  background: rgba(157, 230, 189, 0.08);
  transform: translateY(-2px);
}

.rune-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  width: min(300px, 100%);
  color: @gold;
}

.rune-divider::before,
.rune-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(202, 174, 112, 0.58));
}

.rune-divider::after { transform: rotate(180deg); }

.skip-link {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 100;
  padding: 10px 14px;
  color: #080a08;
  background: @goldBright;
  transform: translateY(-160%);
}

.skip-link:focus { transform: translateY(0); }

.page-enter-active,
.page-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
}

.page-enter-from { opacity: 0; transform: translateY(8px); }
.page-leave-to { opacity: 0; transform: translateY(-5px); }

@media (max-width: 720px) {
  .page-shell {
    width: min(100% - 36px, @contentWidth);
    padding-top: 58px;
  }

  .page-heading { margin-bottom: 38px; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
