<template>
  <div class="lost-page page-shell">
    <PageAtmosphere />
    <div class="lost-rune" aria-hidden="true">404</div>
    <div class="eyebrow">Lost Realm</div>
    <h1>{{ t('notFound.title') }}</h1>
    <p>{{ t('notFound.body') }}</p>
    <router-link class="button-primary" to="/">{{ t('notFound.action') }}</router-link>
  </div>
</template>
<script setup lang="ts">
import PageAtmosphere from '@/components/PageAtmosphere.vue'
import { useI18n } from '@/i18n'
const { t } = useI18n()
</script>
<style scoped lang="less">
@import '../css/variables.less';
.lost-page { min-height: 70vh; display: flex; align-items: center; justify-content: center; flex-direction: column; text-align: center; }
.lost-rune { color: transparent; -webkit-text-stroke: 1px rgba(226, 189, 114, 0.45); font-family: @displayFont; font-size: clamp(7rem, 24vw, 18rem); font-weight: 700; line-height: .8; text-shadow: 0 0 60px rgba(226, 189, 114, 0.12); animation: lost-flicker 6s ease-in-out infinite; }
@keyframes lost-flicker { 0%, 100% { opacity: 1; } 46% { opacity: 1; } 48% { opacity: 0.4; } 50% { opacity: 0.9; } 52% { opacity: 0.5; } 54% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .lost-rune { animation: none; } }
.lost-page .eyebrow { margin-top: -20px; }
.lost-page h1 { font-size: clamp(2rem, 5vw, 4rem); }
.lost-page p { max-width: 500px; margin: 20px 0 32px; color: @mutedText; }
</style>
