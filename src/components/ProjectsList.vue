<template>
  <section class="project-browser">
    <div v-if="filters.length > 1" class="filters" :aria-label="t('projects.filter')">
      <span class="filters-count" aria-live="polite">{{ countLabel }}</span>
      <div class="filter-buttons">
        <button
          type="button"
          :class="{ active: activeFilter === 'all' }"
          :aria-pressed="activeFilter === 'all'"
          @click="activeFilter = 'all'"
        >{{ t('common.all') }}</button>
        <button
          v-for="filter in filters"
          :key="filter"
          type="button"
          :class="{ active: activeFilter === filter }"
          :aria-pressed="activeFilter === filter"
          @click="activeFilter = filter"
        >{{ filter }}</button>
      </div>
    </div>

    <TransitionGroup name="card" tag="div" class="projects-list">
      <button
        v-for="(project, index) in filteredProjects"
        :key="project.id"
        v-tilt="isFeatured(index) ? 2 : 5"
        class="project-item"
        :class="{ featured: isFeatured(index) }"
        :style="{ '--accent': project.accentColor, '--i': index }"
        type="button"
        :aria-label="`${t('common.viewDetails')}: ${projectTitle(project)}`"
        @click="showDetails(project)"
      >
        <span class="project-media">
          <img :src="project.iconUrl" alt="" loading="lazy" />
        </span>
        <span class="project-body">
          <span class="project-year">{{ project.year }}</span>
          <span class="project-title">{{ splitTitle(project)[0] }}</span>
          <span v-if="splitTitle(project)[1]" class="project-engine">{{ splitTitle(project)[1] }}</span>
          <span class="project-tags">
            <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
          </span>
          <span class="project-action">{{ t('common.viewDetails') }}</span>
        </span>
      </button>
    </TransitionGroup>

    <p v-if="filteredProjects.length === 0" class="empty-state">{{ t('projects.empty') }}</p>

    <ProjectDetailsOverlay
      :visible="Boolean(selectedProject)"
      :title="selectedProject ? splitTitle(selectedProject)[0] : ''"
      :subtitle="selectedProject ? splitTitle(selectedProject)[1] : ''"
      :image="selectedProject?.iconUrl || ''"
      :year="selectedProject?.year || ''"
      :tags="selectedProject?.tags || []"
      :html-content="selectedProject ? projectContent(selectedProject) : ''"
      :color="selectedProject?.accentColor || '#b69457'"
      :index="selectedIndex"
      :total="browseList.length"
      :prev-title="neighbour(-1)"
      :next-title="neighbour(1)"
      @close="closeDetails"
      @navigate="navigate"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProjectDetailsOverlay from '@/components/ProjectDetailsOverlay.vue'
import ProjectData, { localize } from '@/data/ProjectData'
import { useI18n } from '@/i18n'
import { playSfx } from '@/audio/sfx'

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

function splitTitle(project: ProjectData): [string, string] {
  const [title, ...rest] = projectTitle(project).split(' · ')
  return [title, rest.join(' · ')]
}

const browseList = computed(() => filteredProjects.value.some(p => p.id === selectedProject.value?.id)
  ? filteredProjects.value
  : props.projects)
const selectedIndex = computed(() => Math.max(0, browseList.value.findIndex(p => p.id === selectedProject.value?.id)))

function neighbour(direction: 1 | -1) {
  const list = browseList.value
  if (list.length < 2) return ''
  return splitTitle(list[(selectedIndex.value + direction + list.length) % list.length])[0]
}

function navigate(direction: 1 | -1) {
  const list = browseList.value
  showDetails(list[(selectedIndex.value + direction + list.length) % list.length])
}

watch(activeFilter, () => playSfx('filter'))

function isFeatured(index: number) {
  return index === 0 && filteredProjects.value.length % 2 === 1
}

const countLabel = computed(() => {
  const n = filteredProjects.value.length
  return locale.value === 'zh' ? `共 ${n} 个项目` : `${n} ${n === 1 ? 'project' : 'projects'}`
})

function projectContent(project: ProjectData) {
  return localize(project.htmlDescription, locale.value)
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
  padding-bottom: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid @borderColor;
  color: @mutedText;
  font-family: @displayFont;
  font-size: 0.85rem;
  letter-spacing: 0.04em;
}

.filter-buttons { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; }
.filter-buttons button {
  padding: 8px 15px;
  border: 1px solid @borderColor;
  border-radius: 999px;
  color: @mutedText;
  background: rgba(14, 18, 16, 0.6);
  font: inherit;
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  text-transform: none;
  cursor: pointer;
  transition: color 180ms ease, border-color 180ms ease, background 180ms ease;
}
.filter-buttons button:hover { color: @headingColor; border-color: rgba(157, 230, 189, 0.4); }
.filter-buttons button.active { color: #07100a; border-color: @tealGlow; background: @tealGlow; font-weight: 700; }
.filters-count { color: @goldBright; }

.projects-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.project-item {
  --accent: #b69457;
  --mouse-x: 50%;
  --mouse-y: 50%;
  position: relative;
  padding: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid @borderColor;
  color: @textColor;
  background: linear-gradient(160deg, rgba(16, 23, 19, 0.95), rgba(8, 12, 10, 0.95));
  font: inherit;
  text-align: left;
  overflow: hidden;
  cursor: pointer;
  isolation: isolate;
  transition: border-color 240ms ease, box-shadow 400ms ease;
}

.project-item::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 2;
  opacity: 0;
  pointer-events: none;
  background: radial-gradient(520px circle at var(--mouse-x) var(--mouse-y), rgba(157, 230, 189, 0.1), transparent 60%);
  transition: opacity 220ms ease-out;
}

.project-item:hover,
.project-item:focus-visible { border-color: rgba(157, 230, 189, 0.45); box-shadow: 0 30px 70px rgba(0, 0, 0, 0.5); }
.project-item:hover::after,
.project-item:focus-visible::after { opacity: 1; }
.project-item:focus-visible { outline: 2px solid @tealGlow; outline-offset: 3px; }

.project-item::before {
  content: '';
  position: absolute;
  inset: 14px;
  z-index: 3;
  opacity: 0;
  pointer-events: none;
  background:
    linear-gradient(@goldBright, @goldBright) top left / 22px 2px,
    linear-gradient(@goldBright, @goldBright) top left / 2px 22px,
    linear-gradient(@goldBright, @goldBright) top right / 22px 2px,
    linear-gradient(@goldBright, @goldBright) top right / 2px 22px,
    linear-gradient(@goldBright, @goldBright) bottom left / 22px 2px,
    linear-gradient(@goldBright, @goldBright) bottom left / 2px 22px,
    linear-gradient(@goldBright, @goldBright) bottom right / 22px 2px,
    linear-gradient(@goldBright, @goldBright) bottom right / 2px 22px;
  background-repeat: no-repeat;
  transition: inset 360ms cubic-bezier(.2,.7,.2,1), opacity 240ms ease;
}
.project-item:hover::before,
.project-item:focus-visible::before { inset: 8px; opacity: 1; }
.project-media::before {
  content: '';
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: -60%;
  width: 40%;
  background: linear-gradient(100deg, transparent, rgba(255, 244, 214, 0.28), transparent);
  transform: skewX(-18deg);
  pointer-events: none;
}
.project-item:hover .project-media::before { animation: card-sweep 900ms cubic-bezier(.2,.7,.2,1); }
@keyframes card-sweep { to { left: 130%; } }
.project-media { position: relative; display: block; aspect-ratio: 16 / 9; overflow: hidden; background: #070a08; }
.project-media::after { content: ''; position: absolute; inset: 0; background: linear-gradient(0deg, rgba(8, 12, 10, 0.6), transparent 40%); }
.project-media img { width: 100%; height: 100%; object-fit: cover; filter: saturate(0.88) brightness(0.9); transition: transform 800ms cubic-bezier(.2,.7,.2,1), filter 300ms ease; }
.project-item:hover .project-media img,
.project-item:focus-visible .project-media img { transform: scale(1.04); filter: saturate(1) brightness(1); }

.project-body { position: relative; z-index: 1; flex: 1; padding: 26px 28px 28px; display: flex; flex-direction: column; align-items: flex-start; border-top: 1px solid @borderColor; }

.project-item.featured { grid-column: 1 / -1; display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); border-color: rgba(226, 189, 114, 0.3); }
.project-item.featured .project-media { aspect-ratio: auto; min-height: 420px; }
.project-item.featured .project-media::after { background: linear-gradient(90deg, transparent 65%, rgba(8, 12, 10, 0.85)); }
.project-item.featured .project-action { margin-top: 26px; }
.project-item.featured .project-body { justify-content: center; padding: clamp(28px, 3.4vw, 48px); border-top: 0; border-left: 1px solid rgba(226, 189, 114, 0.3); }

.project-year { color: @goldBright; font-family: @displayFont; font-size: 0.82rem; font-weight: 600; letter-spacing: 0.06em; }
.project-title { margin-top: 10px; color: @headingColor; font-family: @displayFont; font-size: clamp(1.3rem, 2vw, 1.7rem); font-weight: 600; line-height: 1.15; letter-spacing: 0.01em; }
.project-item.featured .project-title { font-size: clamp(1.8rem, 3vw, 2.6rem); }
.project-engine { margin-top: 6px; color: @tealGlow; font-size: 0.95rem; }
.project-tags { margin-top: 18px; display: flex; flex-wrap: wrap; gap: 6px; }
.project-tags span { padding: 4px 10px; border: 1px solid @borderColor; border-radius: 999px; color: #b8c3bb; background: rgba(157, 230, 189, 0.03); font-size: 0.74rem; }
.project-action { margin-top: auto; padding-top: 22px; color: @tealGlow; font-size: 0.95rem; font-weight: 700; text-decoration: underline; text-decoration-color: rgba(157, 230, 189, 0.35); text-underline-offset: 5px; }
.project-item:hover .project-action { text-decoration-color: @tealGlow; }

.card-enter-active { transition: opacity 420ms ease, transform 520ms cubic-bezier(.2,.7,.2,1); transition-delay: calc(var(--i) * 50ms); }
.card-leave-active { transition: opacity 180ms ease; position: absolute; visibility: hidden; }
.card-enter-from { opacity: 0; transform: translateY(18px) scale(0.98); }
.card-leave-to { opacity: 0; }
.card-move { transition: transform 420ms cubic-bezier(.2,.7,.2,1); }

.empty-state { padding: 80px 0; color: @mutedText; text-align: center; }

@media (max-width: 850px) {
  .projects-list { grid-template-columns: 1fr; }
  .project-item.featured { grid-template-columns: 1fr; }
  .project-item.featured .project-media { min-height: 0; aspect-ratio: 16 / 9; }
  .project-item.featured .project-body { border-left: 0; border-top: 1px solid rgba(226, 189, 114, 0.3); }
}

@media (max-width: 600px) {
  .filters { align-items: flex-start; flex-direction: column; }
  .filter-buttons { justify-content: flex-start; }
  .project-body { padding: 22px; }
}

@media (prefers-reduced-motion: reduce) {
  .card-enter-active, .card-move { transition: none; }
}
</style>
