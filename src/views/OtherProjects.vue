<template>
  <div class="page-shell">
    <header class="page-heading">
      <div class="eyebrow">{{ t('other.eyebrow') }}</div>
      <h1 class="page-title">{{ t('other.title') }}</h1>
      <p class="page-lead">{{ t('other.intro') }}</p>
    </header>
    <ProjectsList :projects="projects" />
  </div>
</template>

<script setup lang="ts">
import ProjectsList from '@/components/ProjectsList.vue'
import otherProjectsData from '@/data/OtherProjectsData'
import { useI18n } from '@/i18n'

const projects = otherProjectsData
const { t } = useI18n()
</script>
