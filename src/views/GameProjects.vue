<template>
  <div class="page-shell">
    <header class="page-heading">
      <div class="eyebrow">{{ t('games.eyebrow') }}</div>
      <h1 class="page-title">{{ t('games.title') }}</h1>
      <p class="page-lead">{{ t('games.intro') }}</p>
    </header>
    <ProjectsList :projects="projects" />
  </div>
</template>

<script setup lang="ts">
import ProjectsList from '@/components/ProjectsList.vue'
import gameProjectsData from '@/data/GameProjectsData'
import { useI18n } from '@/i18n'

const projects = gameProjectsData
const { t } = useI18n()
</script>
