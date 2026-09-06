<template>
  <Teleport to="body">
    <transition name="dialog-fade">
      <div
        v-if="visible"
        class="dialog-layer"
        role="presentation"
        @mousedown.self="emit('close')"
      >
        <section
          ref="dialog"
          class="dialog"
          role="dialog"
          aria-modal="true"
          :aria-label="`${t('projects.dialogLabel')}: ${title}`"
          :style="{ '--project-color': color }"
          @keydown="handleKeydown"
        >
          <header class="dialog-header">
            <div>
              <span class="dialog-kicker">{{ t('projects.dialogLabel') }}</span>
              <h2>{{ title }}</h2>
            </div>
            <button ref="closeButton" class="dialog-close" type="button" :aria-label="t('common.close')" @click="emit('close')">
              <span aria-hidden="true">×</span>
            </button>
          </header>
          <div class="dialog-content">
            <!-- Project copy is authored locally in the repository. -->
            <div v-html="htmlContent"></div>
          </div>
          <footer class="dialog-footer">
            <button class="button-ghost" type="button" @click="emit('close')">{{ t('common.close') }}</button>
          </footer>
        </section>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from '@/i18n'

const props = defineProps<{
  visible: boolean
  color: string
  title: string
  htmlContent: string
}>()

const emit = defineEmits<{ close: [] }>()
const { t } = useI18n()
const dialog = ref<HTMLElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)
let previousFocus: HTMLElement | null = null

function focusableElements() {
  return dialog.value
    ? Array.from(dialog.value.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])'))
    : []
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close')
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

watch(() => props.visible, async (visible) => {
  document.body.style.overflow = visible ? 'hidden' : ''
  if (visible) {
    previousFocus = document.activeElement as HTMLElement | null
    await nextTick()
    closeButton.value?.focus()
  } else {
    previousFocus?.focus()
  }
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<style lang="less">
@import '../css/variables.less';

.dialog-layer {
  position: fixed;
  inset: 0;
  z-index: 80;
  padding: 48px 24px;
  display: grid;
  place-items: start center;
  overflow-y: auto;
  background: rgba(2, 4, 3, 0.84);
  backdrop-filter: blur(12px);
}

.dialog {
  --project-color: #9de6bd;
  width: min(980px, 100%);
  border: 1px solid color-mix(in srgb, var(--project-color) 60%, #9de6bd);
  background: #0b100d;
  box-shadow: 0 40px 120px rgba(0, 0, 0, 0.72), 0 0 60px color-mix(in srgb, var(--project-color) 8%, transparent);
}

.dialog-header {
  position: relative;
  padding: 34px 38px;
  display: flex;
  justify-content: space-between;
  gap: 30px;
  border-bottom: 1px solid @borderColor;
  background: linear-gradient(135deg, color-mix(in srgb, var(--project-color) 11%, #0b100d), #0b100d 60%);
}

.dialog-kicker { color: @tealGlow; font-size: 0.66rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; }
.dialog-header h2 { margin-top: 8px; font-size: clamp(1.45rem, 4vw, 2.5rem); }
.dialog-close { width: 42px; height: 42px; flex: 0 0 auto; border: 1px solid @borderColor; color: @tealGlow; background: rgba(5, 8, 6, 0.4); font-size: 1.6rem; cursor: pointer; }
.dialog-close:hover { border-color: @tealGlow; background: rgba(157, 230, 189, 0.08); }
.dialog-content { padding: 40px; color: #c5c1b7; line-height: 1.8; }
.dialog-content .paragraph { margin: 0 0 28px; }
.dialog-content strong { color: @headingColor; }
.dialog-content ul { padding-left: 22px; }
.dialog-content li { margin-bottom: 8px; }
.dialog-content a { color: @goldBright; text-decoration: underline; text-underline-offset: 4px; }
.dialog-content iframe { width: 100%; min-height: 420px; border: 0; background: #050706; }
.dialog-content .pc-screenshot { width: min(100%, 760px); margin: 12px auto; display: block; }
.dialog-content .project-video { width: 100%; max-height: 600px; background: #050706; }
.dialog-content .notice { padding: 17px 19px; border-left: 2px solid var(--project-color); background: rgba(157, 230, 189, 0.055); color: #c8d0ca; }
.dialog-footer { padding: 0 40px 40px; display: flex; justify-content: center; }
.dialog-fade-enter-active, .dialog-fade-leave-active { transition: opacity 180ms ease; }
.dialog-fade-enter-from, .dialog-fade-leave-to { opacity: 0; }

@media (max-width: 620px) {
  .dialog-layer { padding: 0; }
  .dialog { min-height: 100vh; border: 0; }
  .dialog-header { padding: 24px 20px; }
  .dialog-content { padding: 28px 20px; }
  .dialog-content iframe { min-height: 220px; }
  .dialog-footer { padding: 0 20px 28px; }
}
</style>
