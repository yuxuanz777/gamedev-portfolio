<template>
  <div class="refero-concept">
    <nav class="refero-nav" aria-label="Concept navigation">
      <router-link class="refero-signature" to="/">SEVEN / ZHANG</router-link>
      <div class="refero-nav-links">
        <a href="#refero-work">{{ copy.nav[1] }}</a>
        <a href="#refero-experience">{{ copy.nav[2] }}</a>
        <router-link to="/resume">{{ copy.resume }}</router-link>
      </div>
    </nav>

    <header class="refero-hero">
      <div class="refero-index" aria-hidden="true">PORTFOLIO / 01</div>
      <div class="refero-hero-copy">
        <p class="refero-kicker">{{ copy.role }}</p>
        <h1>{{ copy.heroTitle }}</h1>
        <p class="refero-lead">{{ copy.heroLead }}</p>
        <div class="refero-actions">
          <a class="refero-button refero-button--solid" href="#refero-work">{{ copy.viewWork }}</a>
          <router-link class="refero-button" to="/contact">{{ copy.contact }}</router-link>
        </div>
      </div>

      <figure class="refero-hero-art">
        <img :src="copy.projects[0].image" :alt="copy.projects[0].title" />
        <figcaption>
          <span>01 / {{ copy.projects[0].date }}</span>
          <strong>{{ copy.projects[0].title }}</strong>
        </figcaption>
      </figure>
    </header>

    <section class="refero-proof" aria-label="Portfolio proof points">
      <div v-for="item in copy.proof" :key="item.label">
        <strong>{{ item.value }}</strong>
        <span>{{ item.label }}</span>
      </div>
    </section>

    <main>
      <section id="refero-work" class="refero-section refero-work">
        <header class="refero-section-heading">
          <span>01</span>
          <div>
            <p>{{ copy.selectedWork }}</p>
            <h2>{{ copy.workIntro }}</h2>
          </div>
        </header>

        <div class="refero-projects">
          <article
            v-for="(project, index) in copy.projects"
            :key="project.title"
            class="refero-project"
            :class="{ 'refero-project--lead': index === 0 }"
          >
            <router-link to="/game-projects" class="refero-project-image">
              <img :src="project.image" :alt="project.title" />
            </router-link>
            <div class="refero-project-copy">
              <p class="refero-project-meta">0{{ index + 1 }} · {{ project.discipline }}</p>
              <h3>{{ project.title }}</h3>
              <p>{{ project.description }}</p>
              <div class="refero-tags">
                <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section id="refero-experience" class="refero-section refero-experience">
        <header class="refero-section-heading">
          <span>02</span>
          <div>
            <p>{{ copy.experience }}</p>
            <h2>{{ copy.experienceRole }}</h2>
          </div>
        </header>
        <div class="refero-experience-body">
          <div>
            <strong>{{ copy.experienceStudio }}</strong>
            <span>{{ copy.experienceDate }}</span>
          </div>
          <p>{{ copy.experienceBody }}</p>
          <router-link to="/resume">{{ copy.resume }} <span aria-hidden="true">↗</span></router-link>
        </div>
      </section>
    </main>

    <footer class="refero-footer">
      <p>{{ copy.closing }}</p>
      <router-link to="/contact">{{ copy.contact }} <span aria-hidden="true">→</span></router-link>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { designLabCopy, type LabLocale } from './content'

const props = defineProps<{ locale: LabLocale }>()
const copy = computed(() => designLabCopy[props.locale])
</script>

<style scoped>
.refero-concept {
  --canvas: #0c0e0c;
  --surface: #141712;
  --ink: #eee9dc;
  --muted: #a7a397;
  --line: rgba(217, 190, 128, 0.24);
  --accent: #d6bb7e;
  --cool: #79aaa2;
  min-height: 100vh;
  color: var(--ink);
  background: var(--canvas);
  font-family: Inter, "Noto Sans SC", "Microsoft YaHei", sans-serif;
}

.refero-concept a { color: inherit; }

.refero-nav {
  min-height: 78px;
  padding: 0 clamp(22px, 4vw, 72px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  border-bottom: 1px solid var(--line);
}

.refero-signature {
  color: var(--accent) !important;
  font-family: Georgia, "Noto Serif SC", serif;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.refero-nav-links { display: flex; align-items: center; gap: clamp(16px, 3vw, 42px); }
.refero-nav-links a {
  color: var(--muted);
  font-size: 0.69rem;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}
.refero-nav-links a:hover { color: var(--ink); }

.refero-hero {
  min-height: min(780px, calc(100vh - 78px));
  display: grid;
  grid-template-columns: 70px minmax(0, 1.05fr) minmax(360px, 0.95fr);
  border-bottom: 1px solid var(--line);
}

.refero-index {
  padding-top: 54px;
  border-right: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  text-align: center;
  writing-mode: vertical-rl;
}

.refero-hero-copy {
  padding: clamp(72px, 10vw, 148px) clamp(34px, 7vw, 110px);
  align-self: center;
}

.refero-kicker,
.refero-section-heading p,
.refero-project-meta {
  margin: 0;
  color: var(--cool);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.refero-hero h1 {
  max-width: 820px;
  margin: 28px 0 0;
  color: var(--ink);
  font-family: Georgia, "Noto Serif SC", serif;
  font-size: clamp(3rem, 6.5vw, 7.4rem);
  font-weight: 400;
  letter-spacing: -0.045em;
  line-height: 0.98;
  text-wrap: balance;
}

.refero-lead {
  max-width: 59ch;
  margin: 32px 0 0;
  color: var(--muted);
  font-size: clamp(1rem, 1.3vw, 1.16rem);
  line-height: 1.72;
}

.refero-actions { margin-top: 38px; display: flex; flex-wrap: wrap; gap: 12px; }
.refero-button {
  min-height: 48px;
  padding: 0 20px;
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--line);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: color 140ms ease-out, border-color 140ms ease-out, transform 140ms ease-out;
}
.refero-button:hover { border-color: var(--accent); transform: translateY(-2px); }
.refero-button--solid { color: #11140f !important; background: var(--accent); border-color: var(--accent); }

.refero-hero-art { position: relative; min-height: 620px; margin: 0; overflow: hidden; }
.refero-hero-art::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 45%, rgba(5, 7, 5, 0.9));
  pointer-events: none;
}
.refero-hero-art img { width: 100%; height: 100%; object-fit: cover; filter: saturate(0.82) contrast(1.04); }
.refero-hero-art figcaption {
  position: absolute;
  z-index: 1;
  right: 34px;
  bottom: 34px;
  left: 34px;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
}
.refero-hero-art figcaption span { color: var(--accent); font-size: 0.66rem; letter-spacing: 0.12em; }
.refero-hero-art figcaption strong { font-family: Georgia, "Noto Serif SC", serif; font-size: 1.25rem; }

.refero-proof {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-bottom: 1px solid var(--line);
}
.refero-proof div { min-height: 138px; padding: 32px clamp(24px, 4vw, 64px); border-right: 1px solid var(--line); }
.refero-proof div:last-child { border-right: 0; }
.refero-proof strong { display: block; color: var(--accent); font-family: Georgia, "Noto Serif SC", serif; font-size: 1.75rem; font-weight: 400; }
.refero-proof span { display: block; margin-top: 8px; color: var(--muted); font-size: 0.71rem; letter-spacing: 0.08em; text-transform: uppercase; }

.refero-section { padding: clamp(90px, 12vw, 170px) clamp(22px, 7vw, 110px); }
.refero-section-heading { display: grid; grid-template-columns: 70px minmax(0, 780px); gap: clamp(22px, 5vw, 70px); }
.refero-section-heading > span { color: var(--accent); font-family: Georgia, serif; font-size: 1.1rem; }
.refero-section-heading h2 {
  margin: 18px 0 0;
  color: var(--ink);
  font-family: Georgia, "Noto Serif SC", serif;
  font-size: clamp(2rem, 4vw, 4.4rem);
  font-weight: 400;
  line-height: 1.1;
}

.refero-projects { margin-top: 76px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 70px 28px; }
.refero-project { min-width: 0; }
.refero-project--lead { grid-column: 1 / -1; display: grid; grid-template-columns: 1.35fr 0.65fr; gap: clamp(34px, 6vw, 90px); align-items: center; }
.refero-project-image { display: block; aspect-ratio: 16 / 10; overflow: hidden; background: var(--surface); }
.refero-project-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 320ms cubic-bezier(.2, 0, 0, 1), filter 180ms ease-out; }
.refero-project-image:hover img { transform: scale(1.018); filter: saturate(1.08); }
.refero-project-copy { padding-top: 24px; }
.refero-project--lead .refero-project-copy { padding-top: 0; }
.refero-project h3 { margin: 16px 0 0; color: var(--ink); font-family: Georgia, "Noto Serif SC", serif; font-size: clamp(1.8rem, 3vw, 3.8rem); font-weight: 400; }
.refero-project-copy > p:not(.refero-project-meta) { max-width: 56ch; margin: 20px 0 0; color: var(--muted); line-height: 1.7; }
.refero-tags { margin-top: 24px; display: flex; flex-wrap: wrap; gap: 8px; }
.refero-tags span { padding: 7px 10px; border: 1px solid var(--line); color: var(--muted); font-size: 0.65rem; letter-spacing: 0.06em; }

.refero-experience { border-top: 1px solid var(--line); background: var(--surface); }
.refero-experience-body { max-width: 820px; margin: 66px 0 0 auto; }
.refero-experience-body > div { display: flex; justify-content: space-between; gap: 30px; padding-bottom: 18px; border-bottom: 1px solid var(--line); }
.refero-experience-body strong { font-size: 0.86rem; }
.refero-experience-body span { color: var(--accent); font-size: 0.72rem; letter-spacing: 0.07em; }
.refero-experience-body p { margin: 28px 0; color: var(--muted); font-size: 1.02rem; line-height: 1.8; }
.refero-experience-body > a { color: var(--accent); font-size: 0.74rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }

.refero-footer { min-height: 250px; padding: 50px clamp(22px, 7vw, 110px); display: flex; align-items: center; justify-content: space-between; gap: 40px; border-top: 1px solid var(--line); }
.refero-footer p { max-width: 720px; margin: 0; font-family: Georgia, "Noto Serif SC", serif; font-size: clamp(1.8rem, 4vw, 4rem); line-height: 1.12; }
.refero-footer a { flex: 0 0 auto; color: var(--accent); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }

@media (max-width: 900px) {
  .refero-hero { grid-template-columns: 38px 1fr; }
  .refero-hero-art { grid-column: 1 / -1; min-height: 460px; }
  .refero-project--lead { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .refero-nav-links a:not(:last-child) { display: none; }
  .refero-hero { grid-template-columns: 1fr; }
  .refero-index { display: none; }
  .refero-hero-copy { padding: 72px 22px; }
  .refero-hero-art { min-height: 390px; }
  .refero-proof { grid-template-columns: 1fr; }
  .refero-proof div { min-height: auto; border-right: 0; border-bottom: 1px solid var(--line); }
  .refero-projects { grid-template-columns: 1fr; }
  .refero-project--lead { grid-column: auto; display: block; }
  .refero-project--lead .refero-project-copy { padding-top: 24px; }
  .refero-section-heading { grid-template-columns: 42px 1fr; }
  .refero-experience-body > div { flex-direction: column; gap: 8px; }
  .refero-footer { align-items: flex-start; flex-direction: column; }
}
</style>
