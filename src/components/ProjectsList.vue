<template>
  <section class="project-browser">
    <div v-if="filters.length > 1" class="filters" :aria-label="t('projects.filter')">
      <span>{{ t('projects.filter') }}</span>
      <div class="filter-buttons">
        <button
          type="button"
          :class="{ active: activeFilter === 'all' }"
          @click="activeFilter = 'all'"
        >{{ t('common.all') }}</button>
        <button
          v-for="filter in filters"
          :key="filter"
          type="button"
          :class="{ active: activeFilter === filter }"
          @click="activeFilter = filter"
        >{{ filter }}</button>
      </div>
    </div>

    <div class="projects-list">
      <button
        v-for="project in filteredProjects"
        :key="project.id"
        class="project-item"
        :class="{ wide: project.isWide, high: project.isHigh }"
        :style="{ '--accent': project.accentColor }"
        type="button"
        :aria-label="`${t('common.viewDetails')}: ${projectTitle(project)}`"
        @pointermove="moveSpotlight"
        @click="showDetails(project)"
      >
        <img :src="project.iconUrl" :alt="projectTitle(project)" loading="lazy" />
        <span class="project-shade" aria-hidden="true"></span>
        <span class="project-meta">
          <span class="project-year">{{ project.year }}</span>
          <span class="project-title">{{ projectTitle(project) }}</span>
          <span class="project-tags">
            <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
          </span>
          <span class="project-action">{{ t('common.viewDetails') }} <b aria-hidden="true">↗</b></span>
        </span>
      </button>
    </div>

    <p v-if="filteredProjects.length === 0" class="empty-state">{{ t('projects.empty') }}</p>

    <ProjectDetailsOverlay
      :visible="Boolean(selectedProject)"
      :title="selectedProject ? projectTitle(selectedProject) : ''"
      :html-content="selectedProject ? projectContent(selectedProject) : ''"
      :color="selectedProject?.accentColor || '#b69457'"
      @close="closeDetails"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProjectDetailsOverlay from '@/components/ProjectDetailsOverlay.vue'
import ProjectData, { localize } from '@/data/ProjectData'
import { useI18n } from '@/i18n'

const props = defineProps<{ projects: ProjectData[] }>()
const route = useRoute()
const router = useRouter()
const { locale, t } = useI18n()

const activeFilter = ref('all')
const selectedProject = ref<ProjectData | null>(null)
const filters = computed(() => Array.from(new Set(props.projects.flatMap(project => project.tags))))
const filteredProjects = computed(() => activeFilter.value === 'all'
  ? props.projects
  : props.projects.filter(project => project.tags.includes(activeFilter.value)))

function projectTitle(project: ProjectData) {
  return localize(project.name, locale.value)
}

function projectContent(project: ProjectData) {
  return localize(project.htmlDescription, locale.value)
}

function moveSpotlight(event: PointerEvent) {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  target.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`)
  target.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`)
}

function showDetails(project: ProjectData) {
  selectedProject.value = project
  void router.replace({ query: { ...route.query, project: project.id } })
}

function closeDetails() {
  selectedProject.value = null
  const query = { ...route.query }
  delete query.project
  void router.replace({ query })
}

watch(() => route.query.project, (projectId) => {
  if (typeof projectId !== 'string') {
    selectedProject.value = null
    return
  }
  selectedProject.value = props.projects.find(project => project.id === projectId) ?? null
}, { immediate: true })
</script>

<style scoped lang="less">
@import '../css/variables.less';

.filters {
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  color: @mutedText;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.filter-buttons { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; }
.filter-buttons button {
  padding: 8px 13px;
  border: 1px solid @borderColor;
  color: @mutedText;
  background: rgba(14, 18, 16, 0.68);
  font: inherit;
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: color 180ms ease, border-color 180ms ease, background 180ms ease;
}
.filter-buttons button:hover,
.filter-buttons button.active { color: @tealGlow; border-color: @tealGlow; background: rgba(157, 230, 189, 0.08); }

.projects-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.project-item {
  --accent: #b69457;
  --mouse-x: 50%;
  --mouse-y: 50%;
  position: relative;
  min-height: 340px;
  padding: 0;
  border: 1px solid @borderColor;
  color: @textColor;
  background: #0e1210;
  text-align: left;
  overflow: hidden;
  cursor: pointer;
  isolation: isolate;
}

.project-item.wide,
.project-item.high,
.project-item.wide + .project-item:not(.wide) { min-height: 340px; }

.project-item::before {
  content: '';
  position: absolute;
  inset: -1px;
  z-index: 3;
  border: 1px solid transparent;
  transition: border-color 220ms ease, box-shadow 220ms ease;
  pointer-events: none;
}

.project-item::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0;
  pointer-events: none;
  background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(157, 230, 189, 0.16), transparent 64%);
  transition: opacity 180ms ease-out;
}

.project-item:hover::before,
.project-item:focus-visible::before {
  border-color: @tealGlow;
  box-shadow: inset 0 0 42px rgba(157, 230, 189, 0.07);
}
.project-item:hover::after,
.project-item:focus-visible::after { opacity: 1; }

.project-item img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.7) brightness(0.66);
  transition: transform 500ms cubic-bezier(.2,.7,.2,1), filter 300ms ease;
}

.project-item:hover img,
.project-item:focus-visible img { transform: scale(1.025); filter: saturate(0.95) brightness(0.76); }

.project-shade {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(0deg, rgba(5, 8, 6, 0.99) 0%, rgba(5, 8, 6, 0.35) 72%, rgba(5, 8, 6, 0.12) 100%);
}

.project-meta {
  position: absolute;
  inset: auto 0 0;
  z-index: 2;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.project-year { margin-bottom: 8px; color: @tealGlow; font-size: 0.66rem; letter-spacing: 0.16em; }
.project-title { color: @headingColor; font-family: @displayFont; font-size: clamp(1.3rem, 2.4vw, 2rem); line-height: 1.25; }
.project-tags { margin-top: 14px; display: flex; flex-wrap: wrap; gap: 7px; }
.project-tags span { padding: 4px 7px; border: 1px solid rgba(216, 212, 200, 0.18); color: #bcb8ad; font-size: 0.64rem; letter-spacing: 0.06em; }
.project-action { margin-top: 22px; color: @tealGlow; font-size: 0.68rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0; transform: translateY(8px); transition: opacity 180ms ease, transform 180ms ease; }
.project-item:hover .project-action,
.project-item:focus-visible .project-action { opacity: 1; transform: translateY(0); }
.project-action b { margin-left: 5px; font-size: 0.9rem; }
.empty-state { padding: 80px 0; color: @mutedText; text-align: center; }

@media (max-width: 850px) {
  .projects-list { grid-template-columns: 1fr; }
  .project-item,
  .project-item.wide,
  .project-item.wide + .project-item:not(.wide),
  .project-item.high { min-height: 380px; }
}

@media (max-width: 600px) {
  .filters { align-items: flex-start; flex-direction: column; }
  .filter-buttons { justify-content: flex-start; }
  .project-item,
  .project-item.high { min-height: 380px; }
  .project-meta { padding: 24px; }
  .project-action { opacity: 1; transform: none; }
}
</style>
