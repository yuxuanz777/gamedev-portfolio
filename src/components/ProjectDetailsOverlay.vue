<template>
  <Teleport to="body">
    <transition name="codex" @after-enter="onOpened">
      <div
        v-if="visible"
        class="codex-layer"
        role="presentation"
        @mousedown.self="emit('close')"
      >
        <svg class="codex-burst" viewBox="0 0 600 600" aria-hidden="true">
          <circle cx="300" cy="300" r="280" />
          <circle cx="300" cy="300" r="240" class="ticks" />
          <polygon points="300,80 490,410 110,410" />
          <polygon points="300,520 110,190 490,190" class="teal" />
        </svg>

        <section
          ref="dialog"
          class="codex"
          role="dialog"
          aria-modal="true"
          :aria-label="`${t('projects.dialogLabel')}: ${title}`"
          :style="{ '--project-color': color }"
          @keydown="handleKeydown"
        >
          <div class="codex-bar">
            <button ref="closeButton" class="codex-close" type="button" :aria-label="t('common.close')" @click="emit('close')">
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <transition name="codex-swap" mode="out-in">
            <div :key="title" class="codex-inner">
              <header class="codex-hero" @pointermove="parallax" @pointerleave="resetParallax">
                <div class="codex-cover" :style="coverStyle">
                  <img v-if="image" :src="image" alt="" />
                </div>
                <div class="codex-hero-shade" aria-hidden="true"></div>
                <span class="codex-frame" aria-hidden="true"></span>
                <div class="codex-hero-copy">
                  <p class="codex-kicker">
                    <span v-if="year">{{ year }}</span>
                    <span v-if="total > 1" class="codex-count">{{ index + 1 }} / {{ total }}</span>
                  </p>
                  <h2 class="codex-title">{{ title }}</h2>
                  <p v-if="subtitle" class="codex-subtitle">{{ subtitle }}</p>
                </div>
              </header>

              <div class="codex-body">
                <!-- Project copy is authored locally in the repository. -->
                <article class="codex-content" v-html="htmlContent"></article>

                <aside class="codex-sheet">
                  <h3>{{ locale === 'zh' ? '项目档案' : 'Project sheet' }}</h3>
                  <dl>
                    <div v-if="year">
                      <dt>{{ locale === 'zh' ? '时间' : 'Timeline' }}</dt>
                      <dd>{{ year }}</dd>
                    </div>
                    <div v-if="subtitle">
                      <dt>{{ locale === 'zh' ? '引擎 / 平台' : 'Engine' }}</dt>
                      <dd>{{ subtitle }}</dd>
                    </div>
                    <div v-if="tags.length">
                      <dt>{{ locale === 'zh' ? '技术' : 'Built with' }}</dt>
                      <dd class="codex-tags">
                        <span v-for="tag in tags" :key="tag">{{ tag }}</span>
                      </dd>
                    </div>
                  </dl>
                  <nav v-if="total > 1" class="codex-nav" :aria-label="locale === 'zh' ? '切换项目' : 'Browse projects'">
                    <button type="button" @click="go(-1)">
                      <small>{{ locale === 'zh' ? '上一个' : 'Previous' }}</small>
                      <span>{{ prevTitle }}</span>
                    </button>
                    <button type="button" @click="go(1)">
                      <small>{{ locale === 'zh' ? '下一个' : 'Next' }}</small>
                      <span>{{ nextTitle }}</span>
                    </button>
                  </nav>
                  <p v-if="total > 1" class="codex-hint" aria-hidden="true">{{ locale === 'zh' ? '← → 切换 · Esc 关闭' : '← → to browse · Esc to close' }}</p>
                </aside>
              </div>
            </div>
          </transition>
        </section>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from '@/i18n'
import { playSfx } from '@/audio/sfx'

const props = withDefaults(defineProps<{
  visible: boolean
  color: string
  title: string
  htmlContent: string
  subtitle?: string
  image?: string
  year?: string
  tags?: string[]
  index?: number
  total?: number
  prevTitle?: string
  nextTitle?: string
}>(), { subtitle: '', image: '', year: '', tags: () => [], index: 0, total: 1, prevTitle: '', nextTitle: '' })

const emit = defineEmits<{ close: []; navigate: [direction: 1 | -1] }>()
const { locale, t } = useI18n()
const dialog = ref<HTMLElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)
const shift = ref({ x: 0, y: 0 })
let previousFocus: HTMLElement | null = null

const coverStyle = computed(() => ({
  transform: `translate3d(${shift.value.x}px, ${shift.value.y}px, 0) scale(1.08)`
}))

function parallax(event: PointerEvent) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  shift.value = {
    x: ((event.clientX - rect.left) / rect.width - 0.5) * -18,
    y: ((event.clientY - rect.top) / rect.height - 0.5) * -12
  }
}

function resetParallax() {
  shift.value = { x: 0, y: 0 }
}

function go(direction: 1 | -1) {
  playSfx('page')
  emit('navigate', direction)
  dialog.value?.closest('.codex-layer')?.scrollTo({ top: 0 })
}

function focusableElements() {
  return dialog.value
    ? Array.from(dialog.value.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), video[controls], iframe, [tabindex]:not([tabindex="-1"])'))
    : []
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close')
    return
  }
  if ((event.key === 'ArrowRight' || event.key === 'ArrowLeft') && props.total > 1) {
    const target = event.target as HTMLElement
    if (target.tagName !== 'VIDEO') {
      event.preventDefault()
      go(event.key === 'ArrowRight' ? 1 : -1)
    }
    return
  }
  if (event.key !== 'Tab') return

  const focusable = focusableElements()
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

function onOpened() {
  closeButton.value?.focus()
}

watch(() => props.visible, async (visible) => {
  document.body.style.overflow = visible ? 'hidden' : ''
  if (visible) {
    playSfx('open')
    previousFocus = document.activeElement as HTMLElement | null
    await nextTick()
    closeButton.value?.focus()
  } else {
    playSfx('close')
    resetParallax()
    previousFocus?.focus()
  }
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<style lang="less">
@import '../css/variables.less';

.codex-layer {
  position: fixed;
  inset: 0;
  z-index: 80;
  padding: 40px 24px;
  display: grid;
  place-items: start center;
  overflow-y: auto;
  overscroll-behavior: contain;
  background:
    radial-gradient(ellipse at 50% 30%, rgba(157, 230, 189, 0.08), transparent 60%),
    rgba(2, 4, 3, 0.88);
  backdrop-filter: blur(14px) saturate(120%);
}

/* The summoning flash that plays once as the codex opens */
.codex-burst {
  position: fixed;
  top: 50%;
  left: 50%;
  width: min(90vmin, 760px);
  pointer-events: none;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.4) rotate(-60deg);
}
.codex-burst * { fill: none; stroke: #e2bd72; stroke-width: 1.2; }
.codex-burst .ticks { stroke-width: 8; stroke-dasharray: 1 12; }
.codex-burst .teal { stroke: #9de6bd; }

.codex {
  --project-color: #9de6bd;
  position: relative;
  width: min(1180px, 100%);
  border: 1px solid rgba(226, 189, 114, 0.35);
  background: linear-gradient(180deg, #0d1411, #080c0a 40%);
  box-shadow: 0 50px 140px rgba(0, 0, 0, 0.8), 0 0 80px color-mix(in srgb, var(--project-color) 10%, transparent);
}
.codex::before,
.codex::after {
  content: '';
  position: absolute;
  z-index: 3;
  width: 56px;
  height: 56px;
  border: solid @goldBright;
  pointer-events: none;
}
.codex::before { top: -7px; left: -7px; border-width: 2px 0 0 2px; }
.codex::after { right: -7px; bottom: -7px; border-width: 0 2px 2px 0; }

.codex-bar { position: sticky; z-index: 5; top: 0; height: 0; }
.codex-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(226, 189, 114, 0.45);
  color: @goldBright;
  background: rgba(5, 8, 6, 0.7);
  backdrop-filter: blur(8px);
  font-size: 1.7rem;
  line-height: 1;
  cursor: pointer;
  transition: transform 240ms ease, background 200ms ease, color 200ms ease;
}
.codex-close:hover { color: #07100a; background: @goldBright; transform: rotate(90deg); }

/* Hero */
.codex-hero { position: relative; min-height: clamp(320px, 52vh, 520px); display: flex; align-items: flex-end; overflow: hidden; isolation: isolate; }
.codex-cover { position: absolute; inset: -20px; z-index: -3; transition: transform 500ms cubic-bezier(.2, .7, .2, 1); }
.codex-cover img { width: 100%; height: 100%; object-fit: cover; filter: saturate(0.95); animation: codex-cover-in 1.4s cubic-bezier(.2, .7, .2, 1) both; }
.codex-hero-shade {
  position: absolute;
  inset: 0;
  z-index: -2;
  background:
    linear-gradient(0deg, #0d1411 2%, rgba(13, 20, 17, 0.75) 32%, rgba(13, 20, 17, 0.1) 70%),
    linear-gradient(90deg, rgba(8, 12, 10, 0.8), transparent 60%);
}
.codex-frame { position: absolute; inset: 18px; z-index: -1; border: 1px solid rgba(226, 189, 114, 0.22); pointer-events: none; }
.codex-hero-copy { width: 100%; padding: clamp(28px, 4vw, 56px); }
.codex-kicker { margin: 0; display: flex; gap: 14px; align-items: center; color: @goldBright; font-family: @displayFont; font-size: 0.95rem; font-weight: 600; letter-spacing: 0.06em; }
.codex-count { padding-left: 14px; border-left: 1px solid rgba(226, 189, 114, 0.4); color: @mutedText; }
.codex-title {
  margin-top: 12px;
  font-size: clamp(2.2rem, 5.4vw, 4.4rem);
  font-weight: 700;
  line-height: 1.02;
  text-shadow: 0 6px 30px rgba(0, 0, 0, 0.7);
  clip-path: inset(0 100% 0 0);
  animation: codex-forge 1s cubic-bezier(.7, 0, .2, 1) 220ms forwards;
}
.codex-subtitle { margin: 12px 0 0; color: @tealGlow; font-size: 1.15rem; }

/* Body */
.codex-body { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: clamp(28px, 4vw, 56px); padding: clamp(28px, 4vw, 52px); border-top: 1px solid rgba(226, 189, 114, 0.3); }
.codex-content { min-width: 0; color: #c9d1ca; font-size: 1.06rem; line-height: 1.8; }
.codex-content .paragraph { margin: 0 0 30px; }
.codex-content .paragraph:first-child { font-size: 1.14rem; color: #dfe6df; }
.codex-content .paragraph:first-child::first-letter { float: left; margin: 6px 10px 0 0; color: @goldBright; font-family: @displayFont; font-size: 3.4rem; font-weight: 700; line-height: 0.8; }
.codex-content strong { color: @headingColor; }
.codex-content .paragraph > strong:first-child:not(:only-child) {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
  color: @tealGlow;
  font-family: @displayFont;
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}
.codex-content .paragraph > strong:first-child:not(:only-child)::after { content: ''; flex: 1; max-width: 140px; height: 1px; background: linear-gradient(90deg, rgba(226, 189, 114, 0.6), transparent); }
.codex-content ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 10px; }
.codex-content li { position: relative; padding: 12px 16px 12px 40px; border: 1px solid rgba(150, 205, 177, 0.14); background: rgba(157, 230, 189, 0.03); transition: border-color 200ms ease, background 200ms ease, transform 240ms ease; }
.codex-content li:hover { border-color: rgba(157, 230, 189, 0.4); background: rgba(157, 230, 189, 0.06); transform: translateX(4px); }
.codex-content li::before { content: ''; position: absolute; left: 16px; top: 1.2em; width: 8px; height: 8px; transform: rotate(45deg); background: @goldBright; box-shadow: 0 0 10px rgba(226, 189, 114, 0.7); }
.codex-content .center { text-align: center; }
.codex-content iframe,
.codex-content .project-video {
  width: 100%;
  aspect-ratio: 16 / 9;
  height: auto;
  min-height: 0;
  display: block;
  border: 1px solid rgba(226, 189, 114, 0.35);
  background: #050706;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.5);
}
.codex-content .pc-screenshot { width: min(100%, 760px); margin: 14px auto; display: block; border: 1px solid rgba(150, 205, 177, 0.2); }
.codex-content .notice { padding: 0; border: 0; background: none; }
.codex-content .notice a {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  padding: 0 22px;
  color: #07100a;
  background: linear-gradient(180deg, #b5f0cd, @tealGlow);
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 10px 30px rgba(157, 230, 189, 0.16);
  transition: filter 200ms ease, transform 200ms ease;
}
.codex-content .notice a:hover { filter: brightness(1.06); transform: translateY(-2px); }
.codex-content a { color: @goldBright; text-underline-offset: 4px; }

.codex-sheet { position: sticky; top: 24px; align-self: start; padding: 22px; border: 1px solid rgba(226, 189, 114, 0.26); background: linear-gradient(160deg, rgba(20, 28, 23, 0.9), rgba(8, 12, 10, 0.9)); }
.codex-sheet h3 { margin-bottom: 14px; color: @goldBright; font-size: 1rem; letter-spacing: 0.06em; }
.codex-sheet dl { margin: 0; }
.codex-sheet dl div { padding: 12px 0; border-top: 1px solid rgba(150, 205, 177, 0.12); }
.codex-sheet dt { color: @mutedText; font-size: 0.82rem; }
.codex-sheet dd { margin: 4px 0 0; color: @headingColor; font-size: 1rem; }
.codex-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.codex-tags span { padding: 3px 10px; border: 1px solid rgba(150, 205, 177, 0.22); border-radius: 999px; color: #c9d1ca; font-size: 0.8rem; }
.codex-nav { margin-top: 18px; display: grid; gap: 8px; }
.codex-nav button { padding: 12px 14px; display: grid; gap: 2px; border: 1px solid rgba(150, 205, 177, 0.18); color: @headingColor; background: rgba(5, 8, 6, 0.5); font: inherit; text-align: left; cursor: pointer; transition: border-color 200ms ease, background 200ms ease; }
.codex-nav button:hover { border-color: @tealGlow; background: rgba(157, 230, 189, 0.06); }
.codex-nav small { color: @tealGlow; font-size: 0.78rem; }
.codex-nav span { font-family: @displayFont; font-size: 0.92rem; line-height: 1.3; }
.codex-hint { margin: 14px 0 0; color: rgba(156, 169, 159, 0.7); font-size: 0.78rem; }

/* Open / close choreography */
.codex-enter-active { transition: opacity 260ms ease; }
.codex-enter-active .codex { animation: codex-unroll 720ms cubic-bezier(.16, 1, .3, 1) 160ms both; }
.codex-enter-active .codex-burst { animation: codex-burst 900ms cubic-bezier(.2, .7, .2, 1); }
.codex-leave-active { transition: opacity 240ms ease; }
.codex-leave-active .codex { transition: transform 240ms ease, opacity 240ms ease; }
.codex-enter-from, .codex-leave-to { opacity: 0; }
.codex-leave-to .codex { transform: scale(0.97) translateY(10px); opacity: 0; }

.codex-swap-enter-active, .codex-swap-leave-active { transition: opacity 260ms ease, transform 320ms cubic-bezier(.2, .7, .2, 1); }
.codex-swap-enter-from { opacity: 0; transform: translateX(30px); }
.codex-swap-leave-to { opacity: 0; transform: translateX(-30px); }

@keyframes codex-unroll {
  from { clip-path: inset(49% 0 49% 0); opacity: 0.4; }
  40% { clip-path: inset(49% 0 49% 0); opacity: 1; }
  to { clip-path: inset(-10px -10px -10px -10px); opacity: 1; }
}
@keyframes codex-burst {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.4) rotate(-60deg); }
  35% { opacity: 0.9; }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(1.4) rotate(20deg); }
}
@keyframes codex-cover-in { from { transform: scale(1.12); filter: saturate(0.4) brightness(0.6); } to { transform: none; } }
@keyframes codex-forge { to { clip-path: inset(-10% -10% -10% 0); } }

@media (max-width: 900px) {
  .codex-body { grid-template-columns: 1fr; }
  .codex-sheet { position: static; }
}

@media (max-width: 620px) {
  .codex-layer { padding: 0; }
  .codex { min-height: 100vh; border: 0; }
  .codex::before, .codex::after { display: none; }
  .codex-hero { min-height: 300px; }
  .codex-body { padding: 24px 20px 40px; }
}

@media (prefers-reduced-motion: reduce) {
  .codex-enter-active .codex,
  .codex-enter-active .codex-burst,
  .codex-cover img { animation: none; }
  .codex-title { clip-path: none; animation: none; }
  .codex-cover { transition: none; }
}
</style>
