<template>
  <div class="page-atmosphere" aria-hidden="true">
    <EmberField :density="0.35" />
    <svg class="page-atmosphere-ring" viewBox="0 0 600 600">
      <circle cx="300" cy="300" r="290" />
      <circle cx="300" cy="300" r="276" class="ticks" />
      <circle cx="300" cy="300" r="214" class="dashed" />
      <polygon points="300,120 456,390 144,390" />
      <polygon points="300,480 144,210 456,210" class="teal" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import EmberField from '@/components/EmberField.vue'
</script>

<style scoped>
/* Quiet backdrop for inner pages: a faint cast circle and a few drifting embers. */
.page-atmosphere {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 50%;
  width: 100vw;
  height: min(720px, 90vh);
  transform: translateX(-50%);
  overflow: hidden;
  pointer-events: none;
  mask-image: linear-gradient(180deg, black 55%, transparent);
}

.page-atmosphere-ring {
  position: absolute;
  top: -120px;
  right: -120px;
  width: min(640px, 70vw);
  opacity: 0.22;
  animation: atmosphere-spin 120s linear infinite;
}

.page-atmosphere-ring * { fill: none; stroke: #e2bd72; stroke-width: 1; }
.page-atmosphere-ring .ticks { stroke-width: 7; stroke-dasharray: 1 11; opacity: 0.6; }
.page-atmosphere-ring .dashed { stroke: #9de6bd; stroke-dasharray: 4 8; }
.page-atmosphere-ring .teal { stroke: #9de6bd; opacity: 0.7; }

@keyframes atmosphere-spin { to { transform: rotate(360deg); } }

@media (prefers-reduced-motion: reduce) {
  .page-atmosphere-ring { animation: none; }
}
</style>
