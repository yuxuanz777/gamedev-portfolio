<template>
  <div class="ability-bar" role="list" :aria-label="label">
    <div
      v-for="(ability, index) in abilities"
      :key="ability.label"
      class="ability"
      :class="{ 'is-casting': casting === index }"
      role="listitem"
      tabindex="0"
      @pointerenter="cast(index)"
      @focus="cast(index)"
    >
      <span class="ability-key" aria-hidden="true">{{ index + 1 }}</span>
      <span class="ability-sweep" aria-hidden="true"></span>
      <strong>{{ ability.value }}</strong>
      <span class="ability-label">{{ ability.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { playSfx } from '@/audio/sfx'

/**
 * A game-style ability hotbar. Hovering, focusing or pressing the slot's
 * number key "casts" it: a cooldown sweep runs and the slot flashes.
 */
const props = defineProps<{ abilities: { value: string; label: string }[]; label: string }>()
const casting = ref<number | null>(null)
let timer = 0

function cast(index: number) {
  playSfx('cast')
  casting.value = null
  window.clearTimeout(timer)
  requestAnimationFrame(() => {
    casting.value = index
    timer = window.setTimeout(() => { casting.value = null }, 1400)
  })
}

function onKey(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null
  if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return
  if (event.metaKey || event.ctrlKey || event.altKey) return
  const index = Number(event.key) - 1
  if (Number.isInteger(index) && index >= 0 && index < props.abilities.length) cast(index)
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  window.clearTimeout(timer)
})
</script>

<style scoped>
.ability-bar {
  display: grid;
  grid-template-columns: repeat(var(--count, 3), minmax(0, 1fr));
  gap: 14px;
}

.ability {
  --edge: rgba(226, 189, 114, 0.32);
  position: relative;
  min-height: 132px;
  padding: 26px 26px 22px 74px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  overflow: hidden;
  outline: none;
  border: 1px solid var(--edge);
  background:
    linear-gradient(180deg, rgba(226, 189, 114, 0.06), transparent 40%),
    linear-gradient(160deg, #111a15, #080c0a);
  box-shadow: inset 0 0 0 3px rgba(5, 8, 6, 0.9), inset 0 0 0 4px rgba(226, 189, 114, 0.12);
  cursor: default;
  transition: border-color 200ms ease, transform 200ms ease;
}

.ability:hover,
.ability:focus-visible { border-color: #e2bd72; }
.ability:focus-visible { box-shadow: inset 0 0 0 3px rgba(5, 8, 6, 0.9), 0 0 0 2px #9de6bd; }

.ability-key {
  position: absolute;
  top: 50%;
  left: 22px;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(157, 230, 189, 0.4);
  border-bottom-width: 3px;
  border-radius: 6px;
  color: #9de6bd;
  background: #0a0f0c;
  font-family: 'Cinzel', Georgia, serif;
  font-size: 0.9rem;
  font-weight: 700;
  transform: translateY(-50%);
  transition: transform 120ms ease, border-bottom-width 120ms ease;
}

.ability strong {
  position: relative;
  z-index: 1;
  color: #e2bd72;
  font-family: 'Cinzel', 'Noto Serif SC', Georgia, serif;
  font-size: clamp(1.3rem, 2.1vw, 1.9rem);
  font-weight: 700;
  line-height: 1.1;
}

.ability-label {
  position: relative;
  z-index: 1;
  color: #9ca99f;
  font-size: 0.86rem;
}

.ability-sweep {
  position: absolute;
  inset: -40%;
  z-index: 0;
  opacity: 0;
  background: conic-gradient(from 0deg, rgba(157, 230, 189, 0.28) var(--sweep, 0deg), transparent 0);
  pointer-events: none;
}

.ability.is-casting { animation: ability-flash 600ms ease-out; }
.ability.is-casting .ability-key { transform: translateY(calc(-50% + 2px)); border-bottom-width: 1px; }
.ability.is-casting .ability-sweep { opacity: 1; animation: ability-cooldown 1.3s linear forwards; }

@property --sweep {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

@keyframes ability-cooldown {
  from { --sweep: 360deg; opacity: 1; }
  to { --sweep: 0deg; opacity: 0.6; }
}

@keyframes ability-flash {
  0% { box-shadow: inset 0 0 0 3px rgba(5, 8, 6, 0.9), 0 0 0 0 rgba(226, 189, 114, 0.6); }
  100% { box-shadow: inset 0 0 0 3px rgba(5, 8, 6, 0.9), 0 0 0 18px rgba(226, 189, 114, 0); }
}

@media (max-width: 720px) {
  .ability-bar { grid-template-columns: 1fr; }
  .ability { min-height: 100px; }
}

@media (prefers-reduced-motion: reduce) {
  .ability.is-casting,
  .ability.is-casting .ability-sweep { animation: none; }
}
</style>
