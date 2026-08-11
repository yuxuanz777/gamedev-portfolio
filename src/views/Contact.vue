<template>
  <div class="page-shell contact-page">
    <div class="contact-copy">
      <div class="eyebrow">{{ t('contact.eyebrow') }}</div>
      <h1 class="page-title">{{ t('contact.title') }}</h1>
      <p class="page-lead">{{ t('contact.intro') }}</p>
      <div class="availability"><i aria-hidden="true"></i>{{ t('contact.availability') }}</div>
    </div>

    <div class="contact-panel">
      <span class="panel-rune" aria-hidden="true">◇</span>
      <small>{{ t('contact.emailTitle') }}</small>
      <a class="email" href="mailto:yuxuanz7@usc.edu">yuxuanz7@usc.edu</a>
      <p>{{ t('contact.response') }}</p>
      <div class="contact-actions">
        <a class="button-primary" href="mailto:yuxuanz7@usc.edu">{{ t('common.contactMe') }}</a>
        <button class="button-ghost" type="button" @click="copyEmail">
          <i class="fa" :class="copied ? 'fa-check' : 'fa-copy'" aria-hidden="true"></i>
          {{ copied ? t('common.copied') : t('common.copy') }}
        </button>
      </div>
    </div>

    <section class="social-section">
      <h2>{{ t('contact.socialTitle') }}</h2>
      <div class="social-grid">
        <a v-for="link in links" :key="link.label" :href="link.href" target="_blank" rel="noopener">
          <i :class="link.icon" aria-hidden="true"></i>
          <span><strong>{{ link.label }}</strong><small>{{ link.handle }}</small></span>
          <b aria-hidden="true">↗</b>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '@/i18n'

const { t } = useI18n()
const copied = ref(false)
const links = [
  { label: 'GitHub', handle: '@yuxuanz777', href: 'https://github.com/yuxuanz777', icon: 'fa fa-github' },
  { label: 'LinkedIn', handle: '/in/yuxuanz777', href: 'https://linkedin.com/in/yuxuanz777', icon: 'fa fa-linkedin' },
  { label: 'itch.io', handle: '9tchaser', href: 'https://9tchaser.itch.io', icon: 'fa fa-gamepad' },
  { label: 'Steam', handle: 'Sevenzzz', href: 'https://steamcommunity.com/id/Sevenzzz', icon: 'fa fa-steam' }
]

async function copyEmail() {
  try {
    await navigator.clipboard.writeText('yuxuanz7@usc.edu')
    copied.value = true
    window.setTimeout(() => { copied.value = false }, 2200)
  } catch {
    window.location.href = 'mailto:yuxuanz7@usc.edu'
  }
}
</script>

<style scoped lang="less">
@import '../css/variables.less';
.contact-page { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(50px, 9vw, 120px); align-items: center; }
.contact-copy { padding: 40px 0; }
.contact-copy .page-title { max-width: 670px; }
.availability { margin-top: 32px; display: flex; align-items: center; gap: 10px; color: #b7c4c0; font-size: 0.78rem; }
.availability i { width: 8px; height: 8px; border-radius: 50%; background: @tealGlow; box-shadow: 0 0 14px @tealGlow; }
.contact-panel { position: relative; padding: clamp(34px, 6vw, 64px); border: 1px solid @borderColor; background: radial-gradient(circle at 90% 0, rgba(89, 170, 164, 0.11), transparent 36%), rgba(14, 18, 16, 0.8); box-shadow: 0 35px 90px rgba(0,0,0,.3); overflow: hidden; }
.panel-rune { position: absolute; right: 28px; top: 20px; color: rgba(202,174,112,.14); font-size: 6rem; }
.contact-panel small { color: @tealGlow; font-size: .67rem; letter-spacing: .18em; text-transform: uppercase; }
.email { margin-top: 16px; display: block; color: @goldBright; font-family: @displayFont; font-size: clamp(1.25rem, 3vw, 2.1rem); overflow-wrap: anywhere; }
.contact-panel p { color: @mutedText; font-size: .8rem; }
.contact-actions { margin-top: 28px; display: flex; flex-wrap: wrap; gap: 12px; }
.contact-actions button { font-family: @bodyFont; }
.social-section { grid-column: 1 / -1; margin-top: 80px; }
.social-section h2 { margin-bottom: 28px; font-size: clamp(1.7rem, 3vw, 2.6rem); }
.social-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.social-grid a { padding: 24px 20px; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 14px; border: 1px solid rgba(202,174,112,.17); color: @textColor; background: rgba(14,18,16,.65); }
.social-grid a:hover { border-color: rgba(202,174,112,.45); background: rgba(202,174,112,.06); transform: translateY(-2px); }
.social-grid i { color: @tealGlow; font-size: 1.25rem; }
.social-grid strong, .social-grid small { display: block; }
.social-grid strong { color: @headingColor; font-family: @displayFont; font-size: .82rem; }
.social-grid small { margin-top: 4px; color: @mutedText; font-size: .66rem; }
.social-grid b { color: @goldBright; }
@media (max-width: 900px) { .contact-page { grid-template-columns: 1fr; } .social-section { margin-top: 30px; } .social-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 540px) { .social-grid { grid-template-columns: 1fr; } }
</style>
