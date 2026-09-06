<template>
  <div class="studio-concept">
    <nav class="studio-nav" aria-label="Concept navigation">
      <router-link class="studio-logo" to="/">
        <span>SZ</span>
        <strong>SEVEN ZHANG</strong>
      </router-link>
      <p>{{ copy.role }}</p>
      <router-link class="studio-nav-cta" to="/contact">{{ copy.contact }} ↗</router-link>
    </nav>

    <header class="studio-hero">
      <div class="studio-hero-main">
        <p class="studio-label">PORTFOLIO · 2026</p>
        <h1>{{ copy.heroTitle }}</h1>
        <div class="studio-hero-foot">
          <p>{{ copy.heroLead }}</p>
          <a href="#studio-work" class="studio-round-link" :aria-label="copy.viewWork">↓</a>
        </div>
      </div>
      <aside class="studio-profile">
        <img src="/img/photo3.png" alt="Seven Zhang" />
        <div>
          <span>STATUS</span>
          <strong>{{ copy.availability }}</strong>
        </div>
      </aside>
    </header>

    <section class="studio-ledger" aria-label="Portfolio highlights">
      <article v-for="(item, index) in copy.proof" :key="item.label">
        <span>0{{ index + 1 }}</span>
        <strong>{{ item.value }}</strong>
        <p>{{ item.label }}</p>
      </article>
    </section>

    <section class="studio-experience">
      <div class="studio-section-id">EXPERIENCE / 01</div>
      <div class="studio-experience-title">
        <p>{{ copy.experience }}</p>
        <h2>{{ copy.experienceRole }}</h2>
      </div>
      <div class="studio-experience-detail">
        <strong>{{ copy.experienceStudio }}</strong>
        <span>{{ copy.experienceDate }}</span>
        <p>{{ copy.experienceBody }}</p>
        <router-link to="/resume">{{ copy.resume }} ↗</router-link>
      </div>
    </section>

    <main id="studio-work" class="studio-work">
      <header class="studio-work-header">
        <div>
          <p class="studio-label">PROJECT INDEX / 02</p>
          <h2>{{ copy.selectedWork }}</h2>
        </div>
        <p>{{ copy.workIntro }}</p>
      </header>

      <article
        v-for="(project, index) in copy.projects"
        :key="project.title"
        class="studio-project"
      >
        <div class="studio-project-number">0{{ index + 1 }}</div>
        <router-link class="studio-project-image" to="/game-projects">
          <img :src="project.image" :alt="project.title" />
        </router-link>
        <div class="studio-project-copy">
          <div class="studio-project-topline">
            <span>{{ project.discipline }}</span>
            <span>{{ project.date }}</span>
          </div>
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
          <ul>
            <li v-for="tag in project.tags" :key="tag">{{ tag }}</li>
          </ul>
        </div>
      </article>
    </main>

    <footer class="studio-footer">
      <p>SEVEN / 张宇瑄</p>
      <h2>{{ copy.closing }}</h2>
      <div>
        <router-link to="/game-projects">{{ copy.viewWork }} ↗</router-link>
        <router-link to="/contact">{{ copy.contact }} ↗</router-link>
      </div>
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
.studio-concept {
  --paper: #f2efe7;
  --ink: #171915;
  --muted: #5e6259;
  --line: #c9c7bd;
  --signal: #e45b2a;
  min-height: 100vh;
  color: var(--ink);
  background:
    linear-gradient(rgba(23, 25, 21, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(23, 25, 21, 0.035) 1px, transparent 1px),
    var(--paper);
  background-size: 56px 56px;
  font-family: Inter, "Noto Sans SC", "Microsoft YaHei", sans-serif;
}

.studio-concept a { color: inherit; }
.studio-nav {
  min-height: 84px;
  padding: 0 clamp(20px, 4vw, 70px);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  border-bottom: 1px solid var(--ink);
}
.studio-logo { display: inline-flex; align-items: center; gap: 13px; justify-self: start; }
.studio-logo span { width: 38px; height: 38px; display: grid; place-items: center; color: var(--paper); background: var(--ink); font-size: 0.7rem; font-weight: 800; letter-spacing: 0.04em; }
.studio-logo strong { font-size: 0.72rem; letter-spacing: 0.12em; }
.studio-nav > p { margin: 0; color: var(--muted); font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; }
.studio-nav-cta { justify-self: end; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }

.studio-hero { min-height: 680px; display: grid; grid-template-columns: 1fr minmax(300px, 32vw); border-bottom: 1px solid var(--ink); }
.studio-hero-main { padding: clamp(70px, 10vw, 140px) clamp(24px, 6vw, 96px) 54px; display: flex; flex-direction: column; }
.studio-label { margin: 0; color: var(--signal); font-size: 0.69rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; }
.studio-hero h1 {
  max-width: 1040px;
  margin: 32px 0 64px;
  font-family: Arial, "Noto Sans SC", sans-serif;
  font-size: clamp(3.5rem, 8.2vw, 9.4rem);
  font-weight: 700;
  letter-spacing: -0.065em;
  line-height: 0.88;
  text-wrap: balance;
}
.studio-hero-foot { margin-top: auto; display: flex; align-items: end; justify-content: space-between; gap: 36px; }
.studio-hero-foot p { max-width: 58ch; margin: 0; color: var(--muted); font-size: 1.02rem; line-height: 1.65; }
.studio-round-link { width: 54px; height: 54px; flex: 0 0 auto; display: grid; place-items: center; border: 1px solid var(--ink); border-radius: 50%; font-size: 1.25rem; transition: color 140ms ease-out, background-color 140ms ease-out, transform 140ms ease-out; }
.studio-round-link:hover { color: var(--paper); background: var(--ink); transform: translateY(3px); }

.studio-profile { display: flex; flex-direction: column; margin: 0; border-left: 1px solid var(--ink); }
.studio-profile img { width: 100%; flex: 1 1 auto; min-height: 0; object-fit: cover; filter: grayscale(1) contrast(1.08); }
.studio-profile > div { min-height: 102px; padding: 22px; display: flex; flex-direction: column; justify-content: center; gap: 8px; border-top: 1px solid var(--ink); }
.studio-profile span { color: var(--signal); font-size: 0.65rem; font-weight: 800; letter-spacing: 0.14em; }
.studio-profile strong { font-size: 0.82rem; }

.studio-ledger { display: grid; grid-template-columns: repeat(3, 1fr); border-bottom: 1px solid var(--ink); }
.studio-ledger article { min-height: 180px; padding: 26px clamp(20px, 4vw, 62px); display: grid; grid-template-columns: auto 1fr; align-content: center; gap: 8px 22px; border-right: 1px solid var(--ink); }
.studio-ledger article:last-child { border-right: 0; }
.studio-ledger span { color: var(--signal); font-size: 0.65rem; font-weight: 800; }
.studio-ledger strong { font-size: clamp(1.45rem, 2.5vw, 2.5rem); letter-spacing: -0.035em; }
.studio-ledger p { grid-column: 2; margin: 0; color: var(--muted); font-size: 0.77rem; letter-spacing: 0.04em; }

.studio-experience { display: grid; grid-template-columns: 0.42fr 0.8fr 1.2fr; border-bottom: 1px solid var(--ink); }
.studio-experience > * { padding: clamp(34px, 5vw, 78px); border-right: 1px solid var(--ink); }
.studio-experience > *:last-child { border-right: 0; }
.studio-section-id { color: var(--signal); font-size: 0.68rem; font-weight: 800; letter-spacing: 0.12em; }
.studio-experience-title p { margin: 0 0 16px; color: var(--muted); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
.studio-experience-title h2 { font-size: clamp(2rem, 4vw, 4.6rem); line-height: 0.95; letter-spacing: -0.05em; }
.studio-experience-detail { display: grid; grid-template-columns: 1fr auto; align-content: start; gap: 16px 30px; }
.studio-experience-detail > span { color: var(--signal); font-size: 0.72rem; font-weight: 800; letter-spacing: 0.06em; }
.studio-experience-detail p { grid-column: 1 / -1; max-width: 70ch; margin: 16px 0 10px; color: var(--muted); line-height: 1.7; }
.studio-experience-detail a { grid-column: 1 / -1; justify-self: start; border-bottom: 1px solid var(--ink); font-size: 0.75rem; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; }

.studio-work { padding: clamp(88px, 11vw, 160px) clamp(20px, 5vw, 82px); }
.studio-work-header { display: grid; grid-template-columns: 1.2fr 0.8fr; align-items: end; gap: 40px; padding-bottom: 48px; border-bottom: 2px solid var(--ink); }
.studio-work-header h2 { margin: 18px 0 0; font-size: clamp(3rem, 7vw, 7.7rem); letter-spacing: -0.06em; line-height: 0.9; }
.studio-work-header > p { max-width: 48ch; margin: 0 0 5px; color: var(--muted); line-height: 1.7; }

.studio-project { display: grid; grid-template-columns: 80px minmax(320px, 0.92fr) minmax(300px, 1.08fr); gap: clamp(24px, 4vw, 68px); align-items: center; padding: 58px 0; border-bottom: 1px solid var(--line); }
.studio-project-number { align-self: start; color: var(--signal); font-size: 0.72rem; font-weight: 800; }
.studio-project-image { aspect-ratio: 16 / 10; overflow: hidden; background: #d8d5cd; }
.studio-project-image img { width: 100%; height: 100%; object-fit: cover; filter: saturate(0.7); transition: transform 260ms cubic-bezier(.2, 0, 0, 1), filter 180ms ease-out; }
.studio-project-image:hover img { transform: scale(1.02); filter: saturate(1); }
.studio-project-topline { display: flex; justify-content: space-between; gap: 20px; color: var(--muted); font-size: 0.66rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; }
.studio-project h3 { margin: 22px 0 0; font-size: clamp(2rem, 4.6vw, 5.2rem); letter-spacing: -0.055em; line-height: 0.95; }
.studio-project-copy > p { max-width: 58ch; margin: 24px 0 0; color: var(--muted); line-height: 1.7; }
.studio-project ul { margin: 26px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; list-style: none; }
.studio-project li { padding: 7px 10px; border: 1px solid var(--ink); font-size: 0.65rem; font-weight: 700; letter-spacing: 0.04em; }

.studio-footer { padding: clamp(80px, 12vw, 170px) clamp(24px, 6vw, 96px); color: var(--paper); background: var(--ink); }
.studio-footer > p { margin: 0; color: #f49770; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.12em; }
.studio-footer h2 { max-width: 1000px; margin: 40px 0 64px; color: var(--paper); font-size: clamp(3rem, 7vw, 8rem); letter-spacing: -0.06em; line-height: 0.9; }
.studio-footer > div { display: flex; flex-wrap: wrap; gap: 16px 34px; }
.studio-footer a { border-bottom: 1px solid #f49770; color: #f5b096; font-size: 0.74rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }

@media (max-width: 900px) {
  .studio-nav { grid-template-columns: 1fr auto; }
  .studio-nav > p { display: none; }
  .studio-hero { grid-template-columns: 1fr; }
  .studio-profile { min-height: 520px; border-top: 1px solid var(--ink); border-left: 0; }
  .studio-experience { grid-template-columns: 0.5fr 1.5fr; }
  .studio-experience-detail { grid-column: 1 / -1; border-top: 1px solid var(--ink); }
  .studio-experience-title { border-right: 0; }
  .studio-project { grid-template-columns: 42px 1fr; }
  .studio-project-image,
  .studio-project-copy { grid-column: 2; }
}

@media (max-width: 640px) {
  .studio-logo strong { display: none; }
  .studio-hero h1 { font-size: clamp(3rem, 17vw, 5.4rem); }
  .studio-ledger { grid-template-columns: 1fr; }
  .studio-ledger article { min-height: 130px; border-right: 0; border-bottom: 1px solid var(--ink); }
  .studio-experience { grid-template-columns: 1fr; }
  .studio-experience > * { border-right: 0; border-bottom: 1px solid var(--ink); }
  .studio-work-header { grid-template-columns: 1fr; }
  .studio-project { grid-template-columns: 1fr; }
  .studio-project-number,
  .studio-project-image,
  .studio-project-copy { grid-column: 1; }
  .studio-project-image { min-width: 0; }
}
</style>
