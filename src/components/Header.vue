<template>
  <header class="site-header">
    <div class="header-inner">
      <router-link class="brand" to="/" aria-label="Seven Zhang home">
        <span class="brand-mark" aria-hidden="true"><span>VII</span></span>
        <span class="brand-copy">
          <strong>Seven Zhang</strong>
          <small>{{ t('common.brandRole') }}</small>
        </span>
      </router-link>

      <nav class="nav-bar" :aria-label="locale === 'zh' ? '主要导航' : 'Primary navigation'">
        <router-link to="/">{{ t('nav.about') }}</router-link>
        <router-link to="/game-projects">{{ t('nav.games') }}</router-link>
        <router-link to="/other-projects">{{ t('nav.other') }}</router-link>
        <router-link to="/resume">{{ t('nav.resume') }}</router-link>
        <router-link to="/contact">{{ t('nav.contact') }}</router-link>
      </nav>

      <button
        class="language-switch"
        type="button"
        :aria-label="t('common.languageLabel')"
        :title="t('common.languageLabel')"
        @click="toggleLocale"
      >
        <span class="language-rune" aria-hidden="true">ZH / EN</span>
        {{ t('common.language') }}
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from '@/i18n'

const { locale, t, toggleLocale } = useI18n()
</script>

<style scoped lang="less">
@import '../css/variables.less';

.site-header {
  position: sticky;
  top: 0;
  z-index: 30;
  border-bottom: 1px solid @borderColor;
  background: rgba(5, 8, 6, 0.84);
  backdrop-filter: blur(18px) saturate(130%);
}

.header-inner {
  min-height: 76px;
  max-width: @contentWidth;
  margin: 0 auto;
  padding: 0 28px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 28px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: @textColor;
  opacity: 1;
}

.brand-mark {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  transform: rotate(45deg);
  border: 1px solid @tealGlow;
  background: rgba(157, 230, 189, 0.035);
  box-shadow: inset 0 0 18px rgba(157, 230, 189, 0.05), 0 0 24px rgba(157, 230, 189, 0.08);
}

.brand-mark span {
  transform: rotate(-45deg);
  color: @tealGlow;
  font-weight: 800;
  font-size: 0.55rem;
  letter-spacing: 0.08em;
}

.brand-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.brand-copy strong {
  font-family: @displayFont;
  color: @headingColor;
  font-size: 0.88rem;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.brand-copy small {
  margin-top: 4px;
  color: @mutedText;
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.nav-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(12px, 2vw, 30px);
}

.nav-bar a {
  position: relative;
  padding: 28px 0 24px;
  color: @mutedText;
  opacity: 1;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: color 180ms ease;
}

.nav-bar a::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 17px;
  width: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, @tealGlow, transparent);
  transform: translateX(-50%);
  transition: width 180ms ease;
}

.nav-bar a:hover,
.nav-bar .router-link-exact-active {
  color: @tealGlow;
}

.nav-bar a:hover::after,
.nav-bar .router-link-exact-active::after {
  width: 100%;
}

.language-switch {
  min-width: 72px;
  padding: 9px 12px;
  border: 1px solid @borderColor;
  background: rgba(157, 230, 189, 0.035);
  color: @tealGlow;
  font: inherit;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: background 180ms ease, border-color 180ms ease, transform 180ms ease;
}

.language-switch:hover {
  border-color: @tealGlow;
  background: rgba(157, 230, 189, 0.09);
  transform: translateY(-1px);
}

.language-rune { margin-right: 6px; color: @mutedText; font-size: 0.55rem; }

@media (max-width: 900px) {
  .header-inner {
    min-height: auto;
    grid-template-columns: 1fr auto;
    gap: 8px 16px;
    padding: 12px 18px 0;
  }

  .nav-bar {
    grid-column: 1 / -1;
    order: 3;
    justify-content: flex-start;
    gap: 24px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .nav-bar::-webkit-scrollbar { display: none; }

  .nav-bar a {
    flex: 0 0 auto;
    padding: 12px 0 15px;
  }

  .nav-bar a::after { bottom: 8px; }
}

@media (max-width: 480px) {
  .brand-copy small { display: none; }
  .brand-mark { width: 32px; height: 32px; }
  .nav-bar { gap: 18px; }
  .nav-bar a { font-size: 0.68rem; }
}
</style>
