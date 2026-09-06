<template>
  <div
    ref="viewport"
    class="logo-loop"
    :class="{ 'logo-loop--reduced': reducedMotion }"
    @mouseenter="paused = pauseOnHover"
    @mouseleave="paused = false"
  >
    <div class="logo-loop__track" :style="trackStyle">
      <ul
        v-for="copyIndex in copies"
        :key="copyIndex"
        :ref="copyIndex === 1 ? setSequence : undefined"
        class="logo-loop__sequence"
        :aria-hidden="copyIndex === 1 ? undefined : true"
      >
        <li v-for="item in items" :key="`${copyIndex}-${item.src}`" class="logo-loop__item">
          <img
            :src="item.src"
            :alt="copyIndex === 1 ? item.alt : ''"
            width="1256"
            height="1256"
            :loading="copyIndex === 1 ? 'eager' : 'lazy'"
            :fetchpriority="copyIndex === 1 ? 'high' : 'auto'"
          />
        </li>
      </ul>
    </div>
    <span class="logo-loop__rail" aria-hidden="true"></span>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

interface LogoLoopItem {
  src: string
  alt: string
}

const props = withDefaults(defineProps<{
  items: LogoLoopItem[]
  speed?: number
  pauseOnHover?: boolean
  direction?: 'left' | 'right'
}>(), {
  speed: 14,
  pauseOnHover: false,
  direction: 'left'
})

const viewport = ref<HTMLElement | null>(null)
const sequence = ref<HTMLElement | null>(null)
const offset = ref(0)
const sequenceWidth = ref(0)
const paused = ref(false)
const reducedMotion = ref(false)
const copies = 4

let frame = 0
let lastTime = 0
let resizeObserver: ResizeObserver | null = null
let mediaQuery: MediaQueryList | null = null

const trackStyle = computed(() => {
  const translateX = props.direction === 'right'
    ? offset.value - sequenceWidth.value
    : -offset.value

  return { transform: `translate3d(${translateX}px, 0, 0)` }
})

function setSequence(element: unknown) {
  sequence.value = element as HTMLElement | null
}

function measure() {
  sequenceWidth.value = sequence.value?.getBoundingClientRect().width ?? 0
}

function animate(time: number) {
  if (!lastTime) lastTime = time
  const delta = Math.min((time - lastTime) / 1000, 0.1)
  lastTime = time

  if (!paused.value && !reducedMotion.value && sequenceWidth.value > 0) {
    offset.value = (offset.value + props.speed * delta) % sequenceWidth.value
  }

  frame = requestAnimationFrame(animate)
}

function updateMotionPreference(event?: MediaQueryListEvent) {
  reducedMotion.value = event?.matches ?? mediaQuery?.matches ?? false
  if (reducedMotion.value) offset.value = 0
}

onMounted(async () => {
  await nextTick()
  measure()
  resizeObserver = new ResizeObserver(measure)
  if (viewport.value) resizeObserver.observe(viewport.value)
  if (sequence.value) resizeObserver.observe(sequence.value)
  mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  updateMotionPreference()
  mediaQuery.addEventListener('change', updateMotionPreference)
  frame = requestAnimationFrame(animate)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  resizeObserver?.disconnect()
  mediaQuery?.removeEventListener('change', updateMotionPreference)
})
</script>

<style scoped>
.logo-loop {
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 0;
  overflow: hidden;
  isolation: isolate;
  background: transparent;
}

.logo-loop::before,
.logo-loop::after {
  content: '';
  position: absolute;
  z-index: 2;
  top: 0;
  bottom: 0;
  width: 16%;
  pointer-events: none;
}

.logo-loop::before { left: 0; background: linear-gradient(90deg, rgba(5, 8, 6, 0.92), transparent); }
.logo-loop::after { right: 0; background: linear-gradient(90deg, transparent, rgba(5, 8, 6, 0.92)); }

.logo-loop__track { position: relative; z-index: 1; height: 100%; width: max-content; display: flex; align-items: center; will-change: transform; }
.logo-loop__sequence { height: 100%; margin: 0; padding: 0; display: flex; align-items: center; list-style: none; }

.logo-loop__item {
  width: clamp(280px, 25vw, 430px);
  flex: 0 0 auto;
  aspect-ratio: 1;
  margin: 0 clamp(26px, 3.2vw, 52px) 0 0;
  padding: 0;
  display: grid;
  place-items: center;
  border: 0;
  background: transparent;
}

.logo-loop__item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0.8;
  filter: saturate(0.9) contrast(1.04);
}

.logo-loop__rail {
  display: none;
}

.logo-loop__rail::after {
  content: '';
  position: absolute;
  top: -2px;
  left: 22%;
  width: 44px;
  height: 5px;
  background: #9de6bd;
  box-shadow: 0 0 18px rgba(157, 230, 189, 0.7);
}

.logo-loop--reduced .logo-loop__track { transform: none !important; }

@media (max-width: 900px) { .logo-loop__item { width: clamp(230px, 52vw, 340px); } }
</style>
