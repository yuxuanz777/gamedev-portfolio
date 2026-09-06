<template>
  <KineticConcept :locale="locale" />
</template>

<script setup lang="ts">
import KineticConcept from '@/design-lab/KineticConcept.vue'
import { useI18n } from '@/i18n'

const { locale } = useI18n()
</script>
