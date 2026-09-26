<template>
  <div class="kinetic-concept">
    <div class="kinetic-grid" aria-hidden="true"></div>
    <SiteHeader />

    <header class="kinetic-hero">
      <div class="kinetic-hero-art" aria-hidden="true"></div>
      <EmberField />
      <div class="kinetic-hero-vignette" aria-hidden="true"></div>
      <div class="kinetic-hero-inner">
        <div class="kinetic-hero-copy">
          <p class="kinetic-kicker kinetic-rise" style="--i: 0">{{ t('about.eyebrow') }}</p>
          <h1 class="kinetic-title"><span class="kinetic-title-forge">Seven’s World</span></h1>
          <h2 class="kinetic-rise" style="--i: 3">{{ t('about.title') }}</h2>
          <p class="kinetic-lead kinetic-rise" style="--i: 4">{{ t('about.lead') }}</p>
          <div class="kinetic-actions kinetic-rise" style="--i: 5">
            <div class="magnet-zone" @pointermove="moveMagnet" @pointerleave="resetMagnet">
              <router-link class="kinetic-primary magnet-target" to="/game-projects">{{ copy.viewWork }}</router-link>
            </div>
            <router-link class="kinetic-ghost" to="/contact">{{ copy.contact }}</router-link>
          </div>
          <p class="kinetic-hero-status kinetic-rise" style="--i: 6">
            <i aria-hidden="true"></i>{{ t('about.quest') }}<span>{{ t('about.location') }}</span>
          </p>
        </div>
        <div class="kinetic-sigil">
          <RuneCircle :items="heroIcons" />
        </div>
      </div>
    </header>

    <section class="kinetic-proof" :aria-label="locale === 'zh' ? '能力概览' : 'At a glance'">
      <AbilityBar :abilities="copy.proof" :label="locale === 'zh' ? '能力概览' : 'At a glance'" />
      <p class="kinetic-proof-hint" aria-hidden="true">{{ locale === 'zh' ? '按 1 / 2 / 3 释放' : 'Press 1, 2 or 3 to cast' }}</p>
    </section>

    <section id="kinetic-experience" class="kinetic-experience">
      <div v-reveal class="kinetic-section-label">{{ copy.experience }}</div>
      <div v-reveal="80" class="kinetic-experience-card" @pointermove="moveSpotlight">
        <div class="kinetic-experience-copy">
          <p class="kinetic-experience-studio">{{ copy.experienceStudio }}</p>
          <h2>{{ copy.experienceRole }}</h2>
          <span class="kinetic-experience-date">{{ copy.experienceDate }}</span>
          <p>{{ copy.experienceBody }}</p>
          <router-link to="/resume">{{ copy.resume }}</router-link>
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
      <header v-reveal>
        <div class="kinetic-section-label">{{ copy.selectedWork }}</div>
        <h2>{{ copy.workIntro }}</h2>
      </header>

      <div class="kinetic-project-grid">
        <article
          v-for="(project, index) in copy.projects"
          :key="project.title"
          v-reveal="index === 0 ? 0 : (index - 1) * 110"
          v-tilt="index === 0 ? 3 : 6"
          class="kinetic-card"
          :class="{ 'kinetic-card--featured': index === 0 }"
        >
          <router-link class="kinetic-card-image" to="/game-projects" :aria-label="project.title">
            <img :src="project.image" alt="" width="960" height="540" loading="lazy" />
            <span v-if="index === 0" class="kinetic-card-badge">{{ locale === 'zh' ? '主推项目' : 'Featured' }}</span>
          </router-link>
          <div class="kinetic-card-copy">
            <div class="kinetic-card-meta"><span>{{ project.date }}</span></div>
            <p class="kinetic-card-discipline">{{ project.discipline }}</p>
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
            <p class="kinetic-card-body">{{ project.description }}</p>
            <ul>
              <li v-for="tag in project.tags" :key="tag">{{ tag }}</li>
            </ul>
          </div>
        </article>
      </div>

      <div v-reveal class="kinetic-work-more">
        <router-link to="/game-projects">{{ locale === 'zh' ? '浏览全部游戏项目' : 'Browse all game projects' }}</router-link>
        <router-link to="/other-projects">{{ locale === 'zh' ? '其他作品' : 'Other works' }}</router-link>
      </div>
    </main>

    <section class="kinetic-path">
      <div v-reveal class="kinetic-path-portrait">
        <img src="/img/photo3.png" alt="Seven (Yuxuan) Zhang" width="800" height="1000" loading="lazy" />
        <span class="kinetic-path-ring" aria-hidden="true"></span>
      </div>
      <div v-reveal="120" class="kinetic-path-copy">
        <div class="kinetic-section-label">{{ t('about.introEyebrow') }}</div>
        <h2>{{ t('about.pathTitle') }}</h2>
        <p>{{ t('about.pathBody') }}</p>
        <blockquote>{{ copy.closing }}</blockquote>
        <div class="magnet-zone" @pointermove="moveMagnet" @pointerleave="resetMagnet">
          <router-link class="kinetic-primary magnet-target" to="/contact">{{ copy.contact }}</router-link>
        </div>
      </div>
    </section>
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import EmberField from '@/components/EmberField.vue'
import RuneCircle from '@/components/RuneCircle.vue'
import AbilityBar from '@/components/AbilityBar.vue'
import SiteHeader from '@/components/Header.vue'
import SiteFooter from '@/components/Footer.vue'
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
  --line: rgba(150, 205, 177, 0.16);
  --line-gold: rgba(226, 189, 114, 0.28);
  --signal: #9de6bd;
  --ember: #e2bd72;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --wrap: min(1200px, calc(100% - 64px));
  position: relative;
  min-height: 100vh;
  overflow: clip;
  color: var(--ink);
  background: var(--void);
  font-family: 'Alegreya Sans', 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
  --display: 'Cinzel', 'Noto Serif SC', 'Songti SC', serif;
}
.kinetic-concept a { color: inherit; }
.kinetic-grid {
  position: fixed;
  inset: 0;
  z-index: 0;
  opacity: 0.3;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(157, 230, 189, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(157, 230, 189, 0.035) 1px, transparent 1px);
  background-size: 52px 52px;
  mask-image: radial-gradient(circle at 50% 24%, black, transparent 70%);
}
.kinetic-hero,
.kinetic-proof,
.kinetic-experience,
.kinetic-work,
.kinetic-path { position: relative; z-index: 2; }

/* ---------- Hero: the cast telegraph ---------- */
.kinetic-hero {
  min-height: max(660px, calc(100svh - 76px));
  display: grid;
  align-items: center;
  isolation: isolate;
  overflow: hidden;
}
.kinetic-hero-art,
.kinetic-hero-vignette { position: absolute; inset: 0; }
.kinetic-hero-art {
  z-index: -3;
  background: url('/img/fantasy-hero-v2.jpg') 70% center / cover no-repeat;
  opacity: 0.42;
  transform: scale(1.04);
  animation: kinetic-drift 26s ease-in-out infinite alternate;
}
.kinetic-hero :deep(.ember-field) { z-index: -1; }
.kinetic-hero-vignette {
  z-index: -2;
  background:
    radial-gradient(ellipse at 74% 48%, transparent 0%, rgba(5, 8, 6, 0.35) 38%, rgba(5, 8, 6, 0.9) 75%),
    linear-gradient(90deg, rgba(5, 8, 6, 0.96) 0%, rgba(5, 8, 6, 0.7) 40%, transparent 70%),
    linear-gradient(0deg, #050806 0%, transparent 30%);
}
.kinetic-hero-inner {
  width: var(--wrap);
  margin: 0 auto;
  padding: clamp(56px, 7vw, 96px) 0 clamp(72px, 8vw, 110px);
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  align-items: center;
  gap: clamp(24px, 4vw, 64px);
}
.kinetic-kicker { margin: 0; color: var(--signal); font-family: var(--display); font-size: 0.82rem; font-weight: 600; letter-spacing: 0.08em; }
.kinetic-title {
  margin: 22px 0 0;
  font-family: var(--display);
  font-size: clamp(3.4rem, 7.4vw, 7rem);
  font-weight: 700;
  line-height: 0.92;
  letter-spacing: 0;
  text-transform: uppercase;
  filter: drop-shadow(0 8px 30px rgba(0, 0, 0, 0.55)) drop-shadow(0 0 24px rgba(226, 150, 70, 0.16));
}
.kinetic-title-forge {
  display: inline-block;
  padding-bottom: 0.06em;
  color: var(--ember);
  background: linear-gradient(100deg, #a87b3c 0%, #e2bd72 30%, #fff1cc 44%, #e2bd72 58%, #a87b3c 100%);
  background-size: 260% 100%;
  background-position: 100% 0;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  clip-path: inset(0 100% 0 0);
  animation:
    kinetic-forge 1.3s cubic-bezier(.7, 0, .2, 1) 250ms forwards,
    kinetic-shimmer 7s ease-in-out 1.6s infinite;
}
.kinetic-hero h2 { max-width: 640px; margin: 28px 0 0; font-family: 'Alegreya Sans', 'Noto Sans SC', sans-serif; font-size: clamp(1.45rem, 2.5vw, 2.15rem); font-weight: 700; line-height: 1.22; letter-spacing: -0.005em; }
.kinetic-lead { max-width: 58ch; margin: 18px 0 0; color: #b3bdb5; font-size: 1.06rem; line-height: 1.75; }
.kinetic-actions { margin-top: 34px; display: flex; align-items: center; flex-wrap: wrap; gap: 14px 18px; }
.kinetic-hero-status { margin: 30px 0 0; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; color: var(--muted); font-size: 0.86rem; }
.kinetic-hero-status span { padding-left: 12px; border-left: 1px solid var(--line); }
.kinetic-hero-status i { width: 7px; height: 7px; border-radius: 50%; background: var(--signal); box-shadow: 0 0 12px var(--signal); animation: kinetic-pulse 2.4s ease-in-out infinite; }
.kinetic-rise { opacity: 0; animation: kinetic-rise 900ms var(--ease) forwards; animation-delay: calc(var(--i) * 110ms + 300ms); }

.kinetic-sigil {
  position: relative;
  width: min(100%, 560px);
  justify-self: end;
  opacity: 0;
  transform: scale(0.6) rotate(-40deg);
  animation: kinetic-cast 1.6s cubic-bezier(.16, 1, .3, 1) 500ms forwards;
}
.kinetic-sigil::after {
  content: '';
  position: absolute;
  inset: 8%;
  border-radius: 50%;
  border: 2px solid rgba(226, 189, 114, 0.9);
  opacity: 0;
  pointer-events: none;
  animation: kinetic-impact 1.2s ease-out 1.5s;
}

/* ---------- Buttons ---------- */
.magnet-zone { padding: 30px; margin: -30px; display: inline-block; }
.kinetic-primary,
.kinetic-ghost {
  min-height: 52px;
  padding: 0 24px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.98rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}
.kinetic-primary {
  --magnet-x: 0px;
  --magnet-y: 0px;
  --magnet-duration: 320ms;
  color: #07100a !important;
  background: linear-gradient(180deg, #b5f0cd, var(--signal));
  box-shadow: 0 10px 30px rgba(157, 230, 189, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  transform: translate3d(var(--magnet-x), var(--magnet-y), 0);
  transition: transform var(--magnet-duration) cubic-bezier(.2, 0, 0, 1), box-shadow 200ms ease-out, filter 200ms ease-out;
  will-change: transform;
}
.kinetic-primary:hover { filter: brightness(1.06); box-shadow: 0 14px 40px rgba(157, 230, 189, 0.26), inset 0 1px 0 rgba(255, 255, 255, 0.4); }
.kinetic-ghost { border: 1px solid var(--line-gold); color: var(--ember) !important; background: rgba(5, 8, 6, 0.45); backdrop-filter: blur(8px); transition: border-color 200ms ease, background 200ms ease; }
.kinetic-ghost:hover { border-color: var(--ember); background: rgba(226, 189, 114, 0.08); }
.kinetic-ghost span, .kinetic-primary span { transition: transform 240ms var(--ease); }
.kinetic-ghost:hover span { transform: translateX(4px); }
.kinetic-primary:hover span { transform: translate(2px, -2px); }

/* ---------- Ability bar ---------- */
.kinetic-proof { width: var(--wrap); margin: 0 auto; }
.kinetic-proof-hint { margin: 12px 0 0; color: rgba(156, 169, 159, 0.6); font-size: 0.8rem; text-align: right; }

/* ---------- Section scaffolding ---------- */
.kinetic-section-label { margin: 0; display: flex; align-items: center; gap: 16px; color: var(--signal); font-family: var(--display); font-size: 0.9rem; font-weight: 600; letter-spacing: 0.08em; }
.kinetic-section-label::after { content: ''; flex: 0 0 48px; height: 1px; background: linear-gradient(90deg, var(--line-gold), transparent); }
.kinetic-experience,
.kinetic-work { width: var(--wrap); margin: 0 auto; padding: clamp(88px, 10vw, 136px) 0 0; }

.kinetic-experience-card,
.kinetic-card {
  --mouse-x: 50%;
  --mouse-y: 50%;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--line);
  background: linear-gradient(160deg, rgba(16, 23, 19, 0.92), rgba(8, 12, 10, 0.92));
}
.kinetic-experience-card::before,
.kinetic-card::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0;
  pointer-events: none;
  background: radial-gradient(520px circle at var(--mouse-x) var(--mouse-y), rgba(157, 230, 189, 0.1), transparent 60%);
  transition: opacity 240ms ease-out;
}
.kinetic-experience-card:hover::before,
.kinetic-card:hover::before { opacity: 1; }

/* ---------- Experience ---------- */
.kinetic-experience-card { margin-top: 32px; padding: clamp(28px, 4vw, 52px); display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); align-items: center; gap: clamp(28px, 4.5vw, 64px); }
.kinetic-experience-card::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  padding: 1px;
  pointer-events: none;
  background: conic-gradient(from var(--edge-angle), transparent 0deg, rgba(226, 189, 114, 0.9) 40deg, transparent 90deg, transparent 180deg, rgba(157, 230, 189, 0.7) 220deg, transparent 270deg);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: kinetic-edge 9s linear infinite;
}
.kinetic-experience-card > div { position: relative; z-index: 1; }
.kinetic-experience-studio { margin: 0; color: var(--signal); font-size: 0.92rem; font-weight: 500; }
.kinetic-experience-card h2 { margin: 16px 0 0; font-family: var(--display); font-size: clamp(2rem, 3.6vw, 3.2rem); font-weight: 600; line-height: 1.05; letter-spacing: 0; }
.kinetic-experience-date { margin-top: 18px; display: inline-block; padding: 6px 12px; border: 1px solid var(--line-gold); color: var(--ember); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; }
.kinetic-experience-copy > p:not(.kinetic-experience-studio) { margin: 22px 0 0; color: var(--muted); line-height: 1.8; }
.kinetic-experience-card a { display: inline-flex; gap: 8px; margin-top: 22px; color: var(--signal); font-size: 0.95rem; font-weight: 700; text-decoration: underline; text-decoration-color: rgba(157, 230, 189, 0.35); text-underline-offset: 5px; }
.kinetic-experience-card a span { transition: transform 240ms var(--ease); }
.kinetic-experience-card a:hover span { transform: translateX(4px); }
.kinetic-experience-video { aspect-ratio: 16 / 9; overflow: hidden; border: 1px solid var(--line-gold); background: radial-gradient(circle at 50% 50%, rgba(157, 230, 189, 0.06), transparent 70%), #050806; box-shadow: 0 30px 70px rgba(0, 0, 0, 0.45); }
.kinetic-experience-video iframe { width: 100%; height: 100%; border: 0; display: block; }

/* ---------- Work ---------- */
.kinetic-work > header { display: grid; grid-template-columns: minmax(180px, 0.36fr) 1fr; align-items: start; gap: 40px; }
.kinetic-work > header h2 { max-width: 760px; margin: 0; font-family: 'Alegreya Sans', 'Noto Sans SC', sans-serif; font-size: clamp(1.7rem, 2.9vw, 2.7rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.01em; }
.kinetic-project-grid { margin-top: 56px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
.kinetic-card { min-width: 0; display: flex; flex-direction: column; transition: border-color 240ms ease, transform 360ms var(--ease), box-shadow 360ms var(--ease); }
.kinetic-card:hover { border-color: rgba(157, 230, 189, 0.36); transform: translateY(-4px); box-shadow: 0 28px 60px rgba(0, 0, 0, 0.45); }
.kinetic-card-image { position: relative; z-index: 1; display: block; width: 100%; aspect-ratio: 16 / 10; overflow: hidden; background: #070a08; }
.kinetic-card-image img { width: 100%; height: 100%; object-fit: cover; filter: saturate(0.85) brightness(0.92); transition: filter 300ms ease-out, transform 700ms var(--ease); }
.kinetic-card-image::after { content: ''; position: absolute; inset: 0; background: linear-gradient(0deg, rgba(8, 12, 10, 0.7), transparent 45%); pointer-events: none; }
.kinetic-card:hover .kinetic-card-image img { filter: saturate(1) brightness(1); transform: scale(1.04); }
.kinetic-card-badge { position: absolute; z-index: 2; top: 16px; left: 16px; padding: 6px 12px; color: #1a1206; background: linear-gradient(180deg, #f1d796, var(--ember)); font-family: var(--display); font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em; }
.kinetic-card-copy { position: relative; z-index: 1; flex: 1; padding: clamp(22px, 2.4vw, 30px); display: flex; flex-direction: column; border-top: 1px solid var(--line); }
.kinetic-card-meta { display: flex; justify-content: space-between; gap: 20px; color: var(--ember); font-size: 0.66rem; font-weight: 700; letter-spacing: 0.1em; }
.kinetic-card-discipline { margin: 16px 0 0; color: var(--signal); font-size: 0.86rem; font-weight: 500; }
.kinetic-card-title { margin-top: 10px; display: flex; align-items: center; justify-content: space-between; gap: 14px; }
.kinetic-card h3 { min-width: 0; margin: 0; font-family: var(--display); font-size: clamp(1.25rem, 1.7vw, 1.6rem); font-weight: 600; line-height: 1.12; letter-spacing: 0; }
.kinetic-card-title img { width: 44px; height: 44px; flex: 0 0 auto; object-fit: contain; opacity: 0.9; filter: drop-shadow(0 7px 14px rgba(0, 0, 0, 0.6)); }
.kinetic-card-body { margin: 14px 0 0; color: var(--muted); font-size: 0.88rem; line-height: 1.65; }
.kinetic-card ul { margin: auto 0 0; padding: 20px 0 0; display: flex; flex-wrap: wrap; gap: 6px; list-style: none; }
.kinetic-card li { padding: 5px 10px; border: 1px solid var(--line); border-radius: 999px; color: #b8c3bb; background: rgba(157, 230, 189, 0.03); font-size: 0.64rem; letter-spacing: 0.04em; }

.kinetic-card--featured { grid-column: 1 / -1; display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); border-color: var(--line-gold); }
.kinetic-card--featured .kinetic-card-image { aspect-ratio: auto; min-height: 420px; height: 100%; }
.kinetic-card--featured .kinetic-card-image::after { background: linear-gradient(90deg, transparent 60%, rgba(8, 12, 10, 0.85)); }
.kinetic-card--featured .kinetic-card-copy { padding: clamp(28px, 3.6vw, 52px); justify-content: center; border-top: 0; border-left: 1px solid var(--line-gold); }
.kinetic-card--featured h3 { font-size: clamp(1.9rem, 3vw, 2.8rem); }
.kinetic-card--featured .kinetic-card-title img { width: 64px; height: 64px; }
.kinetic-card--featured .kinetic-card-body { font-size: 0.98rem; }
.kinetic-card--featured ul { margin-top: 0; padding-top: 26px; }

.kinetic-work-more { margin-top: 30px; display: flex; justify-content: flex-end; flex-wrap: wrap; gap: 12px 32px; }
.kinetic-work-more a { display: inline-flex; gap: 8px; color: var(--ember); font-size: 0.95rem; font-weight: 700; text-decoration: underline; text-decoration-color: rgba(226, 189, 114, 0.35); text-underline-offset: 5px; }
.kinetic-work-more a span { transition: transform 240ms var(--ease); }
.kinetic-work-more a:hover span { transform: translateX(4px); }

/* ---------- Path ---------- */
.kinetic-path { width: var(--wrap); margin: clamp(88px, 10vw, 136px) auto 0; padding: clamp(72px, 9vw, 120px) 0 clamp(40px, 5vw, 64px); display: grid; grid-template-columns: minmax(250px, 0.72fr) 1fr; align-items: center; gap: clamp(48px, 8vw, 100px); border-top: 1px solid var(--line); }
.kinetic-path-portrait { position: relative; width: min(100%, 380px); aspect-ratio: 1; padding: 18px; border-radius: 50%; border: 1px solid var(--line-gold); background: radial-gradient(circle, rgba(157, 230, 189, 0.08), transparent 70%); box-shadow: 0 40px 90px rgba(0, 0, 0, 0.5); }
.kinetic-path-portrait img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; filter: saturate(0.85) contrast(1.04); }
.kinetic-path-ring { position: absolute; inset: -14px; border: 1px dashed rgba(157, 230, 189, 0.22); border-radius: 50%; animation: kinetic-spin 60s linear infinite; }
.kinetic-path-ring::before { content: ''; position: absolute; top: 50%; left: -4px; width: 7px; height: 7px; background: var(--ember); transform: rotate(45deg); box-shadow: 0 0 12px var(--ember); }
.kinetic-path-copy h2 { margin: 22px 0 0; font-family: var(--display); font-size: clamp(2.1rem, 3.6vw, 3.6rem); font-weight: 600; line-height: 1.05; letter-spacing: 0; }
.kinetic-path-copy > p { max-width: 62ch; margin: 26px 0 0; color: var(--muted); line-height: 1.85; }
.kinetic-path-copy blockquote { margin: 28px 0 36px; padding-left: 18px; border-left: 1px solid var(--ember); color: var(--ember); font-family: 'Cinzel', 'Noto Serif SC', Georgia, serif; font-size: 1.02rem; line-height: 1.6; }

/* ---------- Motion ---------- */
@keyframes kinetic-rise { from { opacity: 0; transform: translateY(24px); filter: blur(6px); } to { opacity: 1; transform: none; filter: none; } }
@keyframes kinetic-pulse { 50% { opacity: 0.4; box-shadow: 0 0 4px var(--signal); } }
@keyframes kinetic-drift { from { transform: scale(1.04) translate3d(0, 0, 0); } to { transform: scale(1.1) translate3d(-1.5%, -1%, 0); } }
@keyframes kinetic-spin { to { transform: rotate(360deg); } }
@keyframes kinetic-forge { to { clip-path: inset(0 -10% 0 0); } }
@keyframes kinetic-shimmer { 0%, 70% { background-position: 100% 0; } 100% { background-position: -60% 0; } }
@keyframes kinetic-cast { to { opacity: 1; transform: none; } }
@keyframes kinetic-impact { 0% { opacity: 1; transform: scale(0.7); } 100% { opacity: 0; transform: scale(1.18); } }
@keyframes kinetic-edge { to { --edge-angle: 360deg; } }
@property --edge-angle { syntax: '<angle>'; inherits: false; initial-value: 0deg; }

@media (max-width: 1000px) {
  .kinetic-project-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .kinetic-card--featured { grid-template-columns: 1fr; }
  .kinetic-card--featured .kinetic-card-image { min-height: 0; aspect-ratio: 16 / 9; }
  .kinetic-card--featured .kinetic-card-copy { border-left: 0; border-top: 1px solid var(--line-gold); }
  .kinetic-card--featured .kinetic-card-image::after { background: linear-gradient(0deg, rgba(8, 12, 10, 0.7), transparent 45%); }
  .kinetic-hero-inner { grid-template-columns: 1fr; }
  .kinetic-sigil { position: absolute; z-index: -1; top: 4%; right: -18%; width: min(78vw, 520px); }
  .kinetic-sigil.kinetic-sigil { animation-name: kinetic-cast-dim; }
}

@media (max-width: 900px) {
  .kinetic-experience-card { grid-template-columns: 1fr; }
  .kinetic-work > header { grid-template-columns: 1fr; gap: 20px; }
  .kinetic-path { grid-template-columns: 1fr; }
  .kinetic-path-portrait { width: min(100%, 320px); margin: 0 auto; }
}

@media (max-width: 640px) {
  .kinetic-concept { --wrap: calc(100% - 32px); }
  .kinetic-hero-inner { padding: 48px 0 64px; }
  .kinetic-title { font-size: clamp(2.6rem, 13vw, 4.2rem); }
  .kinetic-sigil { top: 0; right: -30%; width: 92vw; }
  .kinetic-project-grid { grid-template-columns: 1fr; }
  .kinetic-work-more { justify-content: flex-start; }
  .kinetic-proof-hint { display: none; }
  .kinetic-hero-status span { width: 100%; padding-left: 17px; border-left: 0; }
}

@media (hover: none) {
  .kinetic-proof-hint { display: none; }
}

@keyframes kinetic-cast-dim { to { opacity: 0.32; transform: none; } }
@media (max-width: 1000px) and (prefers-reduced-motion: reduce) { .kinetic-sigil { opacity: 0.32; } }

@media (prefers-reduced-motion: reduce) {
  .kinetic-primary { transform: none; }
  .kinetic-rise { opacity: 1; animation: none; }
  .kinetic-hero-art { animation: none; }
  .kinetic-title-forge { clip-path: none; animation: none; background-position: 50% 0; }
  .kinetic-sigil { opacity: 1; transform: none; animation: none; }
  .kinetic-sigil::after { animation: none; }
  .kinetic-experience-card::after { animation: none; }
  .kinetic-path-ring { animation: none; }
  .kinetic-card:hover { transform: none; }
}

</style>
