<template>
  <div class="kinetic-concept">
    <div class="kinetic-grid" aria-hidden="true"></div>
    <div class="kinetic-ui-loop" aria-hidden="true">
      <LogoLoop :items="heroIcons" :speed="14" direction="right" />
    </div>
    <SiteHeader />

    <header class="kinetic-hero">
      <div class="kinetic-hero-art" aria-hidden="true"></div>
      <div class="kinetic-hero-vignette" aria-hidden="true"></div>
      <div class="kinetic-hero-copy">
        <p class="kinetic-kicker">{{ t('about.eyebrow') }}</p>
        <h1>Seven’s World</h1>
        <h2>{{ t('about.title') }}</h2>
        <p>{{ t('about.lead') }}</p>
        <div class="kinetic-actions">
          <div class="magnet-zone" @pointermove="moveMagnet" @pointerleave="resetMagnet">
            <router-link class="kinetic-primary magnet-target" to="/game-projects">{{ copy.viewWork }} ↗</router-link>
          </div>
          <router-link class="kinetic-text-link" to="/contact">{{ copy.contact }} →</router-link>
        </div>
        <div class="kinetic-hero-status">
          <span><i aria-hidden="true"></i>{{ t('about.quest') }}</span>
          <span>{{ t('about.location') }}</span>
        </div>
      </div>
    </header>

    <section id="kinetic-experience" class="kinetic-experience">
      <div class="kinetic-section-label"><span>01</span>{{ copy.experience }}</div>
      <div class="kinetic-experience-card" @pointermove="moveSpotlight">
        <div>
          <p>{{ copy.experienceStudio }}</p>
          <h2>{{ copy.experienceRole }}</h2>
        </div>
        <div>
          <span>{{ copy.experienceDate }}</span>
          <p>{{ copy.experienceBody }}</p>
          <router-link to="/resume">{{ copy.resume }} →</router-link>
        </div>
        <div class="kinetic-experience-video">
          <iframe
            src="https://www.youtube.com/embed/vbZMyiAS5YM"
            :title="copy.experienceVideo"
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>

    <main id="kinetic-work" class="kinetic-work">
      <header>
        <div class="kinetic-section-label"><span>02</span>{{ copy.selectedWork }}</div>
        <h2>{{ copy.workIntro }}</h2>
      </header>

      <div class="kinetic-project-grid">
        <article
          v-for="(project, index) in copy.projects"
          :key="project.title"
          class="kinetic-card"
          @pointermove="moveSpotlight"
        >
          <router-link class="kinetic-card-image" to="/game-projects">
            <img :src="project.image" :alt="project.title" width="960" height="540" loading="lazy" />
          </router-link>
          <div class="kinetic-card-copy">
            <div><span>0{{ index + 1 }}</span><span>{{ project.date }}</span></div>
            <p>{{ project.discipline }}</p>
            <div class="kinetic-card-title">
              <h3>{{ project.title }}</h3>
              <img
                v-if="project.brandIcon"
                :src="project.brandIcon"
                :alt="`${project.title} VII mark`"
                width="64"
                height="64"
                loading="lazy"
              />
            </div>
            <p>{{ project.description }}</p>
            <ul>
              <li v-for="tag in project.tags" :key="tag">{{ tag }}</li>
            </ul>
          </div>
        </article>
      </div>
    </main>

    <section class="kinetic-proof">
      <article v-for="item in copy.proof" :key="item.label" @pointermove="moveSpotlight">
        <strong>{{ item.value }}</strong>
        <span>{{ item.label }}</span>
      </article>
    </section>

    <section class="kinetic-path">
      <div class="kinetic-path-portrait">
        <img src="/img/photo3.png" alt="Seven (Yuxuan) Zhang" width="800" height="1000" loading="lazy" />
      </div>
      <div class="kinetic-path-copy">
        <div class="kinetic-section-label"><span>03</span>{{ t('about.introEyebrow') }}</div>
        <h2>{{ t('about.pathTitle') }}</h2>
        <p>{{ t('about.pathBody') }}</p>
        <div class="magnet-zone" @pointermove="moveMagnet" @pointerleave="resetMagnet">
          <router-link class="kinetic-primary magnet-target" to="/contact">{{ copy.contact }} ↗</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LogoLoop from '@/components/LogoLoop.vue'
import SiteHeader from '@/components/Header.vue'
import { useI18n } from '@/i18n'
import { designLabCopy, type LabLocale } from './content'

const props = defineProps<{ locale: LabLocale }>()
const { t } = useI18n()
const copy = computed(() => designLabCopy[props.locale])
const heroIcons = [
  { src: '/img/brand/vii-collector-v3.png', alt: 'VII Collector identity artwork' },
  { src: '/img/brand/vii-shimmer-color.png', alt: 'VII Shimmer identity artwork' },
  { src: '/img/brand/vii-stormwind-v2.png', alt: 'VII Stormwind identity artwork' }
]

function moveSpotlight(event: PointerEvent) {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  target.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`)
  target.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`)
}

function moveMagnet(event: PointerEvent) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const zone = event.currentTarget as HTMLElement
  const target = zone.querySelector<HTMLElement>('.magnet-target')
  if (!target) return
  const rect = zone.getBoundingClientRect()
  const offsetX = (event.clientX - (rect.left + rect.width / 2)) / 4
  const offsetY = (event.clientY - (rect.top + rect.height / 2)) / 4
  target.style.setProperty('--magnet-x', `${offsetX}px`)
  target.style.setProperty('--magnet-y', `${offsetY}px`)
  target.style.setProperty('--magnet-duration', '120ms')
}

function resetMagnet(event: PointerEvent) {
  const zone = event.currentTarget as HTMLElement
  const target = zone.querySelector<HTMLElement>('.magnet-target')
  if (!target) return
  target.style.setProperty('--magnet-x', '0px')
  target.style.setProperty('--magnet-y', '0px')
  target.style.setProperty('--magnet-duration', '320ms')
}
</script>

<style scoped>
.kinetic-concept {
  --void: #050806;
  --panel: #0b100d;
  --ink: #eef3e9;
  --muted: #9ca99f;
  --line: rgba(150, 205, 177, 0.18);
  --signal: #9de6bd;
  --ember: #e2bd72;
  position: relative;
  min-height: 100vh;
  overflow: clip;
  color: var(--ink);
  background: var(--void);
  font-family: Inter, "Noto Sans SC", "Microsoft YaHei", sans-serif;
}
.kinetic-concept a { color: inherit; }
.kinetic-grid {
  position: fixed;
  inset: 0;
  z-index: 0;
  opacity: 0.35;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(157, 230, 189, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(157, 230, 189, 0.035) 1px, transparent 1px);
  background-size: 52px 52px;
  mask-image: radial-gradient(circle at 50% 24%, black, transparent 70%);
}
.kinetic-ui-loop {
  position: fixed;
  z-index: 1;
  top: clamp(150px, 22vh, 250px);
  left: 0;
  width: 100vw;
  height: clamp(290px, 34vw, 440px);
  opacity: 0.48;
  pointer-events: none;
  mask-image: linear-gradient(90deg, transparent, black 14%, black 90%, transparent);
}
.kinetic-hero,
.kinetic-experience,
.kinetic-work,
.kinetic-proof,
.kinetic-path { position: relative; z-index: 2; }

.kinetic-hero { min-height: min(760px, calc(100vh - 76px)); display: grid; align-items: center; isolation: isolate; overflow: hidden; border-bottom: 1px solid var(--line); }
.kinetic-hero-art,
.kinetic-hero-vignette { position: absolute; inset: 0; z-index: -2; }
.kinetic-hero-art { background: url('/img/fantasy-hero-v2.jpg') 62% center / cover no-repeat; opacity: 0.5; }
.kinetic-hero-vignette { z-index: -1; background: linear-gradient(90deg, rgba(5, 8, 6, 0.98) 0%, rgba(5, 8, 6, 0.85) 49%, rgba(5, 8, 6, 0.45) 74%, rgba(5, 8, 6, 0.6) 100%), linear-gradient(0deg, #050806, transparent 30%); }
.kinetic-orbit { position: absolute; z-index: -1; left: -220px; top: 50%; width: 640px; height: 640px; transform: translateY(-50%); border: 1px solid rgba(157, 230, 189, 0.09); border-radius: 50%; }
.kinetic-orbit span { position: absolute; inset: 70px; border: 1px solid rgba(157, 230, 189, 0.08); border-radius: 50%; }
.kinetic-orbit span:nth-child(2) { inset: 145px; }
.kinetic-orbit span:nth-child(3) { inset: 220px; background: radial-gradient(circle, rgba(157, 230, 189, 0.1), transparent 65%); }
.kinetic-hero-copy { width: min(1200px, calc(100% - 64px)); margin: 0 auto; padding: clamp(76px, 9vw, 118px) 0 88px; }
.kinetic-kicker,
.kinetic-section-label { margin: 0; color: var(--signal); font-size: 0.68rem; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; }
.kinetic-hero h1 { max-width: 1080px; margin: 20px 0 0; color: var(--ember); font-family: 'Cinzel', 'Noto Serif SC', Georgia, serif; font-size: clamp(4.2rem, 8.4vw, 7.7rem); font-weight: 500; line-height: 0.92; letter-spacing: -0.055em; text-transform: uppercase; text-shadow: 0 8px 34px rgba(0, 0, 0, 0.5); }
.kinetic-hero h2 { max-width: 850px; margin: 34px 0 0; font-size: clamp(1.7rem, 3.4vw, 2.85rem); font-weight: 600; line-height: 1.2; letter-spacing: -0.035em; }
.kinetic-hero-copy > p:not(.kinetic-kicker) { max-width: 72ch; margin: 24px 0 0; color: #b8c0b9; font-size: 1rem; line-height: 1.75; }
.kinetic-actions { margin-top: 34px; display: flex; align-items: center; flex-wrap: wrap; gap: 12px 28px; }
.kinetic-hero-status { margin-top: 34px; display: flex; flex-wrap: wrap; gap: 12px 30px; color: var(--muted); font-size: 0.73rem; letter-spacing: 0.03em; }
.kinetic-hero-status span { display: flex; align-items: center; gap: 9px; }
.kinetic-hero-status i { width: 7px; height: 7px; border-radius: 50%; background: var(--signal); box-shadow: 0 0 12px var(--signal); }
.magnet-zone { padding: 34px; margin: -34px; display: inline-block; }
.kinetic-primary {
  --magnet-x: 0px;
  --magnet-y: 0px;
  --magnet-duration: 320ms;
  min-height: 52px;
  padding: 0 22px;
  display: inline-flex;
  align-items: center;
  color: #07100a !important;
  background: var(--signal);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transform: translate3d(var(--magnet-x), var(--magnet-y), 0);
  transition: transform var(--magnet-duration) cubic-bezier(.2, 0, 0, 1), background-color 120ms ease-out;
  will-change: transform;
}
.kinetic-primary:hover { background: #c0f6d5; }
.kinetic-text-link { color: var(--ember) !important; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; }
.kinetic-experience,
.kinetic-work { width: min(1200px, calc(100% - 64px)); margin: 0 auto; padding: clamp(82px, 10vw, 128px) 0; }
.kinetic-section-label { display: flex; align-items: center; gap: 18px; }
.kinetic-section-label span { color: var(--ember); }
.kinetic-experience-card,
.kinetic-card,
.kinetic-proof article {
  --mouse-x: 50%;
  --mouse-y: 50%;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--line);
  background: var(--panel);
}
.kinetic-experience-card::before,
.kinetic-card::before,
.kinetic-proof article::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(157, 230, 189, 0.15), transparent 68%);
  transition: opacity 200ms ease-out;
}
.kinetic-experience-card:hover::before,
.kinetic-card:hover::before,
.kinetic-proof article:hover::before { opacity: 1; }
.kinetic-experience-card { margin-top: 36px; padding: clamp(28px, 4vw, 58px); display: grid; grid-template-columns: 0.72fr 0.88fr 1.2fr; align-items: center; gap: clamp(28px, 4vw, 64px); }
.kinetic-experience-card > div { position: relative; z-index: 1; }
.kinetic-experience-card h2 { margin: 16px 0 0; font-size: clamp(2.4rem, 5vw, 6rem); line-height: 0.95; letter-spacing: -0.05em; }
.kinetic-experience-card p { color: var(--muted); line-height: 1.75; }
.kinetic-experience-card > div:first-child p { margin: 0; color: var(--signal); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
.kinetic-experience-card > div:last-child > span { color: var(--ember); font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; }
.kinetic-experience-card a { display: inline-block; margin-top: 10px; color: var(--signal); font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
.kinetic-experience-video { aspect-ratio: 16 / 9; overflow: hidden; border: 1px solid var(--line); background: #050806; }
.kinetic-experience-video iframe { width: 100%; height: 100%; border: 0; display: block; }

.kinetic-work { border-top: 1px solid var(--line); }
.kinetic-work > header { display: grid; grid-template-columns: 0.42fr 1.58fr; align-items: start; gap: 40px; }
.kinetic-work > header h2 { max-width: 860px; margin: 0; font-size: clamp(2.3rem, 4.2vw, 4.4rem); line-height: 1; letter-spacing: -0.045em; }
.kinetic-project-grid { max-width: 1120px; margin: 58px auto 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
.kinetic-card { min-width: 0; display: block; background: rgba(5, 8, 6, 0.18); backdrop-filter: blur(7px); }
.kinetic-card-image { position: relative; z-index: 1; display: block; width: 100%; aspect-ratio: 16 / 9; min-height: 0; overflow: hidden; background: #070a08; }
.kinetic-card-image img { width: 100%; height: 100%; object-fit: contain; filter: saturate(0.82); transition: filter 160ms ease-out, transform 280ms cubic-bezier(.2, 0, 0, 1); }
.kinetic-card:hover .kinetic-card-image img { filter: saturate(1); transform: scale(1.015); }
.kinetic-card-copy { position: relative; z-index: 1; padding: clamp(22px, 3vw, 34px); border-top: 1px solid var(--line); background: linear-gradient(180deg, rgba(11, 16, 13, 0.42), rgba(5, 8, 6, 0.1)); }
.kinetic-card-copy > div { display: flex; justify-content: space-between; gap: 20px; color: var(--ember); font-size: 0.66rem; font-weight: 800; letter-spacing: 0.08em; }
.kinetic-card-copy > p:first-of-type { margin: 24px 0 0; color: var(--signal); font-size: 0.64rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
.kinetic-card-title { margin-top: 12px; display: flex; align-items: center; gap: 14px; }
.kinetic-card h3 { min-width: 0; margin: 0; font-size: clamp(1.65rem, 2.8vw, 3.2rem); line-height: 0.98; letter-spacing: -0.045em; }
.kinetic-card-title img { width: clamp(38px, 4vw, 52px); height: clamp(38px, 4vw, 52px); flex: 0 0 auto; object-fit: contain; opacity: 0.92; filter: drop-shadow(0 7px 14px rgba(0, 0, 0, 0.6)); }
.kinetic-card-copy > p:last-of-type { max-width: 56ch; margin: 18px 0 0; color: var(--muted); font-size: 0.9rem; line-height: 1.62; }
.kinetic-card ul { margin: 20px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 7px; list-style: none; }
.kinetic-card li { padding: 7px 10px; border: 1px solid var(--line); color: var(--muted); font-size: 0.64rem; letter-spacing: 0.05em; }

.kinetic-proof { width: min(1120px, calc(100% - 64px)); margin: 0 auto; padding: 0 0 clamp(82px, 10vw, 128px); display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.kinetic-proof article { min-height: 180px; padding: 32px; display: flex; flex-direction: column; justify-content: flex-end; }
.kinetic-proof article > * { position: relative; z-index: 1; }
.kinetic-proof strong { color: var(--signal); font-size: clamp(1.4rem, 2.5vw, 2.7rem); letter-spacing: -0.035em; }
.kinetic-proof span { margin-top: 8px; color: var(--muted); font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase; }

.kinetic-path { width: min(1200px, calc(100% - 64px)); margin: 0 auto; padding: clamp(82px, 10vw, 132px) 0; display: grid; grid-template-columns: minmax(250px, 0.72fr) 1fr; align-items: center; gap: clamp(48px, 8vw, 100px); border-top: 1px solid var(--line); }
.kinetic-path-portrait { position: relative; max-width: 380px; aspect-ratio: 4 / 5; padding: 8px; border: 1px solid var(--line); background: rgba(157, 230, 189, 0.025); }
.kinetic-path-portrait img { width: 100%; height: 100%; object-fit: cover; filter: saturate(0.72) contrast(1.04); }
.kinetic-path-copy h2 { margin: 22px 0 0; font-size: clamp(2.2rem, 4vw, 4.2rem); line-height: 1; letter-spacing: -0.045em; }
.kinetic-path-copy { padding: clamp(24px, 3vw, 36px); background: rgba(5, 8, 6, 0.82); backdrop-filter: blur(10px); }
.kinetic-path-copy > p { max-width: 62ch; margin: 26px 0 34px; color: var(--muted); line-height: 1.85; }

@keyframes kinetic-word-in { from { opacity: 0; transform: translateY(22px); filter: blur(6px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
@keyframes kinetic-pulse { 50% { opacity: 0.35; box-shadow: 0 0 4px var(--signal); } }

@media (max-width: 900px) {
  .kinetic-ui-loop { top: 180px; width: 72vw; height: 260px; opacity: 0.44; }
  .kinetic-experience-card { grid-template-columns: 1fr 1fr; }
  .kinetic-experience-video { grid-column: 1 / -1; }
  .kinetic-work > header { grid-template-columns: 1fr; }
  .kinetic-path { grid-template-columns: 1fr; }
  .kinetic-path-portrait { width: min(100%, 360px); }
}

@media (max-width: 640px) {
  .kinetic-ui-loop { top: 190px; width: 100vw; height: 210px; opacity: 0.3; }
  .kinetic-hero-copy,
  .kinetic-experience,
  .kinetic-work,
  .kinetic-path { width: min(100% - 36px, 1050px); }
  .kinetic-hero-copy { padding: 86px 0 70px; }
  .kinetic-hero h1 { font-size: clamp(3rem, 16vw, 4.8rem); }
  .kinetic-experience-card { grid-template-columns: 1fr; gap: 30px; }
  .kinetic-experience-video { grid-column: auto; }
  .kinetic-project-grid,
  .kinetic-proof { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .kinetic-primary { transform: none; }
}
</style>
