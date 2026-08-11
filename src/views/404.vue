<template>
  <div class="lost-page page-shell">
    <div class="lost-rune" aria-hidden="true">404</div>
    <div class="eyebrow">Lost Realm</div>
    <h1>{{ t('notFound.title') }}</h1>
    <p>{{ t('notFound.body') }}</p>
    <router-link class="button-primary" to="/">{{ t('notFound.action') }}</router-link>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from '@/i18n'
const { t } = useI18n()
</script>
<style scoped lang="less">
@import '../css/variables.less';
.lost-page { min-height: 70vh; display: flex; align-items: center; justify-content: center; flex-direction: column; text-align: center; }
.lost-rune { color: rgba(202,174,112,.1); font-family: @displayFont; font-size: clamp(7rem, 24vw, 18rem); line-height: .8; }
.lost-page .eyebrow { margin-top: -20px; }
.lost-page h1 { font-size: clamp(2rem, 5vw, 4rem); }
.lost-page p { max-width: 500px; margin: 20px 0 32px; color: @mutedText; }
</style>
