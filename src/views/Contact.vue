<template>
  <div class="page-shell contact-page">
    <PageAtmosphere />
    <div v-reveal class="contact-copy">
      <div class="eyebrow">{{ t('contact.eyebrow') }}</div>
      <h1 class="page-title">{{ t('contact.title') }}</h1>
      <p class="page-lead">{{ t('contact.intro') }}</p>
      <div class="availability"><i aria-hidden="true"></i>{{ t('contact.availability') }}</div>
    </div>

    <div v-reveal="120" class="contact-panel">
      <span class="panel-edge" aria-hidden="true"></span>
      <span class="panel-rune" aria-hidden="true">VII</span>
      <small>{{ t('contact.emailTitle') }}</small>
      <a class="email" href="mailto:yuxuanz7@usc.edu">yuxuanz7@usc.edu</a>
      <p>{{ t('contact.response') }}</p>
      <div class="contact-actions">
        <a class="button-primary" href="mailto:yuxuanz7@usc.edu" @click="onMail">{{ t('common.contactMe') }}</a>
        <button class="button-ghost" type="button" @click="copyEmail($event)">
          <i class="fa" :class="copied ? 'fa-check' : 'fa-copy'" aria-hidden="true"></i>
          {{ copied ? t('common.copied') : t('common.copy') }}
        </button>
      </div>
    </div>

    <section class="social-section">
      <h2 v-reveal>{{ t('contact.socialTitle') }}</h2>
      <div class="social-grid">
        <a v-for="(link, index) in links" v-reveal="index * 80" :key="link.label" :href="link.href" target="_blank" rel="noopener">
          <i :class="link.icon" aria-hidden="true"></i>
          <span><strong>{{ link.label }}</strong><small>{{ link.handle }}</small></span>
          <b aria-hidden="true">↗</b>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import PageAtmosphere from '@/components/PageAtmosphere.vue'
import { ref } from 'vue'
import { useI18n } from '@/i18n'
import { burstFrom } from '@/effects/burst'
import { playSfx } from '@/audio/sfx'

const { t } = useI18n()
const copied = ref(false)
const links = [
  { label: 'GitHub', handle: '@yuxuanz777', href: 'https://github.com/yuxuanz777', icon: 'fa fa-github' },
  { label: 'LinkedIn', handle: '/in/yuxuanz777', href: 'https://linkedin.com/in/yuxuanz777', icon: 'fa fa-linkedin' },
  { label: 'itch.io', handle: '9tchaser', href: 'https://9tchaser.itch.io', icon: 'fa fa-gamepad' },
  { label: 'Steam', handle: 'Sevenzzz', href: 'https://steamcommunity.com/id/Sevenzzz', icon: 'fa fa-steam' }
]

function onMail(event: MouseEvent) {
  burstFrom(event.currentTarget as Element)
  playSfx('cast')
}

async function copyEmail(event: MouseEvent) {
  const button = event.currentTarget as Element
  try {
    await navigator.clipboard.writeText('yuxuanz7@usc.edu')
    burstFrom(button)
    playSfx('enable')
    copied.value = true
    window.setTimeout(() => { copied.value = false }, 2200)
  } catch {
    window.location.href = 'mailto:yuxuanz7@usc.edu'
  }
}
</script>

<style scoped lang="less">
@import '../css/variables.less';
.contact-page { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 32px clamp(48px, 7vw, 100px); align-items: center; }
.contact-copy { padding: 24px 0; }
.contact-copy .page-title { max-width: 640px; }
.availability { margin-top: 30px; padding: 8px 14px; display: inline-flex; align-items: center; gap: 10px; border: 1px solid @borderColor; border-radius: 999px; color: #b7c4c0; font-size: 0.76rem; }
.availability i { width: 8px; height: 8px; flex: 0 0 auto; border-radius: 50%; background: @tealGlow; box-shadow: 0 0 14px @tealGlow; }
.contact-panel { position: relative; padding: clamp(34px, 5vw, 56px); border: 1px solid rgba(226, 189, 114, 0.26); background: radial-gradient(circle at 100% 0, rgba(226, 189, 114, 0.1), transparent 42%), radial-gradient(circle at 0 100%, rgba(157, 230, 189, 0.07), transparent 45%), rgba(11, 16, 13, 0.88); box-shadow: 0 40px 100px rgba(0, 0, 0, 0.45); overflow: hidden; }
.contact-panel::before, .contact-panel::after { content: ''; position: absolute; width: 44px; height: 44px; border: solid @goldBright; pointer-events: none; }
.contact-panel::before { top: 10px; left: 10px; border-width: 1px 0 0 1px; }
.contact-panel::after { right: 10px; bottom: 10px; border-width: 0 1px 1px 0; }
.panel-edge { position: absolute; inset: 0; padding: 1px; pointer-events: none; background: conic-gradient(from var(--edge-angle, 0deg), transparent 0deg, rgba(226, 189, 114, 0.95) 40deg, transparent 100deg, transparent 180deg, rgba(157, 230, 189, 0.8) 220deg, transparent 280deg); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; animation: panel-edge 8s linear infinite; }
@property --edge-angle { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
@keyframes panel-edge { to { --edge-angle: 360deg; } }
@media (prefers-reduced-motion: reduce) { .panel-edge { animation: none; } }
.email { background: linear-gradient(90deg, @goldBright 0%, @goldBright 40%, #fff4d6 50%, @goldBright 60%, @goldBright 100%); background-size: 250% 100%; background-position: 100% 0; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; transition: background-position 900ms ease; }
.email:hover { background-position: 0 0; }
.panel-rune { position: absolute; right: 30px; top: 18px; color: rgba(226, 189, 114, 0.1); font-family: 'Cinzel', Georgia, serif; font-size: 4.4rem; font-weight: 700; letter-spacing: 0; }
.contact-panel small { color: @tealGlow; font-size: .67rem; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; }
.email { margin-top: 14px; display: block; color: @goldBright; font-family: @bodyFont; font-size: clamp(1.5rem, 3vw, 2.4rem); font-weight: 500; letter-spacing: 0; overflow-wrap: anywhere; }
.email:hover { color: #f4dca3; }
.contact-panel p { margin: 12px 0 0; color: @mutedText; font-size: .82rem; }
.contact-actions { margin-top: 30px; display: flex; flex-wrap: wrap; gap: 12px; }
.contact-actions button { font-family: @bodyFont; }
.social-section { grid-column: 1 / -1; margin-top: clamp(40px, 6vw, 72px); padding-top: clamp(40px, 6vw, 64px); border-top: 1px solid @borderColor; }
.social-section h2 { margin-bottom: 26px; font-size: clamp(1.5rem, 2.4vw, 2.1rem); }
.social-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.social-grid a { padding: 22px 20px; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 16px; border: 1px solid @borderColor; color: @textColor; background: rgba(11,16,13,.72); transition: border-color 200ms ease, background 200ms ease, transform 300ms cubic-bezier(.2,.7,.2,1); }
.social-grid a:hover { border-color: rgba(157, 230, 189, 0.5); background: rgba(157,230,189,.05); transform: translateY(-3px); }
.social-grid i { width: 42px; height: 42px; display: grid; place-items: center; border: 1px solid @borderColor; border-radius: 50%; color: @tealGlow; font-size: 1.1rem; }
.social-grid strong, .social-grid small { display: block; }
.social-grid strong { color: @headingColor; font-family: @displayFont; font-size: .88rem; }
.social-grid small { margin-top: 4px; color: @mutedText; font-size: .68rem; }
.social-grid b { color: @goldBright; transition: transform 240ms ease; }
.social-grid a:hover b { transform: translate(2px, -2px); }
@media (max-width: 900px) { .contact-page { grid-template-columns: 1fr; } .social-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 540px) { .social-grid { grid-template-columns: 1fr; } }
</style>
