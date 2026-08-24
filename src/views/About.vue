<template>
  <div>
    <section class="hero">
      <div class="hero-art" aria-hidden="true"></div>
      <div class="hero-vignette" aria-hidden="true"></div>
      <div class="hero-content">
        <div class="eyebrow">{{ t('about.eyebrow') }}</div>
        <h1>Seven's World</h1>
        <h2>{{ t('about.title') }}</h2>
        <p>{{ t('about.lead') }}</p>

        <div class="hero-actions">
          <router-link class="button-primary" to="/game-projects">
            {{ t('common.viewWork') }} <span aria-hidden="true">→</span>
          </router-link>
          <router-link class="button-ghost" to="/contact">
            {{ t('common.contactMe') }}
          </router-link>
        </div>

        <div class="hero-status">
          <span><i aria-hidden="true"></i>{{ t('about.quest') }}</span>
          <span>{{ t('about.location') }}</span>
        </div>
      </div>
    </section>

    <div class="page-shell home-content">
      <section class="stats" :aria-label="locale === 'zh' ? '作品概览' : 'Portfolio highlights'">
        <div><strong>6+</strong><span>{{ t('about.gamesStat') }}</span></div>
        <div><strong>2</strong><span>{{ t('about.enginesStat') }}</span></div>
        <div><strong>1</strong><span>{{ t('about.researchStat') }}</span></div>
      </section>

      <section class="path-section">
        <div class="portrait-frame">
          <img src="/img/photo3.png" alt="Yuxuan Zhang" />
          <span class="frame-corner corner-one" aria-hidden="true"></span>
          <span class="frame-corner corner-two" aria-hidden="true"></span>
        </div>
        <div class="path-copy">
          <div class="eyebrow">INTRO
</div>
          <h2>{{ t('about.pathTitle') }}</h2>
          <p>{{ t('about.pathBody') }}</p>
          <div class="rune-divider" aria-hidden="true">◆</div>
        </div>
      </section>

      <section class="craft-section">
        <div class="section-heading">
          <div class="eyebrow">Arsenal</div>
          <h2>{{ t('about.craftTitle') }}</h2>
        </div>
        <div class="craft-grid">
          <article>
            <span class="craft-number">I</span>
            <div class="craft-icon" aria-hidden="true">⚔</div>
            <h3>{{ t('about.craft1Title') }}</h3>
            <p>{{ t('about.craft1Body') }}</p>
          </article>
          <article>
            <span class="craft-number">II</span>
            <div class="craft-icon" aria-hidden="true">⌘</div>
            <h3>{{ t('about.craft2Title') }}</h3>
            <p>{{ t('about.craft2Body') }}</p>
          </article>
          <article>
            <span class="craft-number">III</span>
            <div class="craft-icon" aria-hidden="true">✦</div>
            <h3>{{ t('about.craft3Title') }}</h3>
            <p>{{ t('about.craft3Body') }}</p>
          </article>
        </div>
      </section>

      <section class="featured-callout">
        <div>
          <div class="eyebrow">Selected Work</div>
          <h2>{{ t('about.featuredTitle') }}</h2>
          <p>{{ t('about.featuredLead') }}</p>
        </div>
        <router-link class="button-ghost" to="/game-projects">{{ t('common.viewWork') }} →</router-link>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/i18n'

const { locale, t } = useI18n()
</script>

<style scoped lang="less">
@import '../css/variables.less';

.hero {
  position: relative;
  min-height: min(830px, calc(100vh - 76px));
  display: grid;
  align-items: center;
  isolation: isolate;
  border-bottom: 1px solid rgba(202, 174, 112, 0.16);
  overflow: hidden;
}

.hero-art,
.hero-vignette {
  position: absolute;
  inset: 0;
  z-index: -2;
}

.hero-art {
  background: url('/img/fantasy-hero-v2.jpg') 62% center / cover no-repeat;
  animation: hero-breathe 18s ease-in-out infinite alternate;
}

.hero-vignette {
  z-index: -1;
  background:
    linear-gradient(90deg, rgba(5, 8, 7, 0.97) 0%, rgba(5, 8, 7, 0.86) 30%, rgba(5, 8, 7, 0.24) 67%, rgba(5, 8, 7, 0.22) 100%),
    linear-gradient(0deg, #080b0a 0%, transparent 28%, rgba(4, 7, 6, 0.22) 100%);
}

.hero-content {
  width: min(@contentWidth, calc(100% - 56px));
  margin: 0 auto;
  padding: 100px 0 116px;
}

.hero h1 {
  margin-left: -0.04em;
  color: @goldBright;
  font-size: clamp(3.4rem, 8.5vw, 7.5rem);
  line-height: 0.98;
  letter-spacing: -0.055em;
  text-shadow: 0 6px 30px rgba(0, 0, 0, 0.5);
}

.hero h2 {
  max-width: 740px;
  margin-top: 24px;
  font-family: @bodyFont;
  font-size: clamp(1.35rem, 2.6vw, 2.25rem);
  font-weight: 500;
  line-height: 1.35;
}

.hero p {
  max-width: 650px;
  margin: 24px 0 0;
  color: #b9b6ad;
  font-size: 1.03rem;
  line-height: 1.8;
}

.hero-actions {
  margin-top: 38px;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.hero-status {
  margin-top: 48px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 30px;
  color: @mutedText;
  font-size: 0.76rem;
  letter-spacing: 0.04em;
}

.hero-status span { display: flex; align-items: center; gap: 9px; }
.hero-status i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: @tealGlow;
  box-shadow: 0 0 14px @tealGlow;
  animation: pulse 2.2s ease-in-out infinite;
}

.stats {
  margin-top: -78px;
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid @borderColor;
  background: rgba(11, 15, 13, 0.9);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(14px);
}

.stats div {
  min-height: 145px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-right: 1px solid @borderColor;
}

.stats div:last-child { border-right: 0; }
.stats strong { color: @goldBright; font-family: @displayFont; font-size: 2.35rem; }
.stats span { color: @mutedText; font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; }

.path-section {
  padding: 130px 0;
  display: grid;
  grid-template-columns: minmax(280px, 0.72fr) 1fr;
  align-items: center;
  gap: clamp(55px, 9vw, 130px);
}

.portrait-frame {
  position: relative;
  max-width: 410px;
  aspect-ratio: 4 / 5;
  padding: 10px;
  border: 1px solid rgba(202, 174, 112, 0.24);
  background: rgba(202, 174, 112, 0.035);
}

.portrait-frame::after {
  content: '';
  position: absolute;
  inset: 18px;
  border: 1px solid rgba(202, 174, 112, 0.18);
  pointer-events: none;
}

.portrait-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.72) contrast(1.04);
}

.frame-corner { position: absolute; width: 52px; height: 52px; border-color: @goldBright; }
.corner-one { left: -9px; top: -9px; border-left: 1px solid; border-top: 1px solid; }
.corner-two { right: -9px; bottom: -9px; border-right: 1px solid; border-bottom: 1px solid; }

.path-copy h2,
.section-heading h2,
.featured-callout h2 { font-size: clamp(2rem, 4vw, 3.7rem); }
.path-copy p,
.featured-callout p { max-width: 650px; color: @mutedText; line-height: 1.9; }
.path-copy p { margin: 25px 0 34px; }

.craft-section { padding: 20px 0 130px; }
.section-heading { margin-bottom: 46px; }
.craft-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }

.craft-grid article {
  position: relative;
  min-height: 330px;
  padding: 40px 34px;
  border: 1px solid @borderColor;
  background:
    linear-gradient(145deg, rgba(202, 174, 112, 0.065), transparent 42%),
    rgba(14, 18, 16, 0.76);
  overflow: hidden;
  transition: transform 220ms ease, border-color 220ms ease, background 220ms ease;
}

.craft-grid article:hover {
  transform: translateY(-6px);
  border-color: rgba(202, 174, 112, 0.48);
  background: linear-gradient(145deg, rgba(202, 174, 112, 0.1), rgba(26, 60, 57, 0.08));
}

.craft-number {
  position: absolute;
  right: 24px;
  top: 20px;
  color: rgba(202, 174, 112, 0.11);
  font-family: @displayFont;
  font-size: 4.5rem;
}

.craft-icon { margin-bottom: 36px; color: @tealGlow; font-size: 2rem; text-shadow: 0 0 20px rgba(89, 170, 164, 0.5); }
.craft-grid h3 { font-size: 1.25rem; }
.craft-grid p { color: @mutedText; font-size: 0.92rem; line-height: 1.75; }

.featured-callout {
  padding: 58px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  border: 1px solid @borderColor;
  background: radial-gradient(circle at 90% 10%, rgba(89, 170, 164, 0.1), transparent 35%), rgba(13, 17, 15, 0.82);
}
.featured-callout p { margin-bottom: 0; }
.featured-callout .button-ghost { flex: 0 0 auto; }

@keyframes hero-breathe { from { transform: scale(1); } to { transform: scale(1.025); } }
@keyframes pulse { 50% { opacity: 0.4; box-shadow: 0 0 5px @tealGlow; } }

@media (max-width: 800px) {
  .hero { min-height: 760px; align-items: end; }
  .hero-art { background-position: 67% center; }
  .hero-vignette { background: linear-gradient(0deg, #080b0a 0%, rgba(5, 8, 7, 0.7) 65%, rgba(5, 8, 7, 0.25) 100%); }
  .hero-content { width: min(100% - 36px, @contentWidth); padding: 180px 0 76px; }
  .hero h1 { font-size: clamp(3.2rem, 16vw, 5.5rem); }
  .stats { margin-top: -50px; }
  .path-section { grid-template-columns: 1fr; padding: 100px 0; }
  .portrait-frame { width: min(100%, 390px); }
  .craft-grid { grid-template-columns: 1fr; }
  .craft-grid article { min-height: auto; }
  .featured-callout { padding: 38px 28px; align-items: flex-start; flex-direction: column; }
}

@media (max-width: 540px) {
  .stats div { min-height: 110px; padding: 18px 8px; }
  .stats strong { font-size: 1.7rem; }
  .stats span { font-size: 0.58rem; text-align: center; }
}
</style>
