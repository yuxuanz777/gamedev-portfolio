import type { Directive } from 'vue'

/**
 * v-reveal: fades and lifts an element into place the first time it scrolls into view.
 * Optional value sets a stagger delay in milliseconds (v-reveal="120").
 * Respects prefers-reduced-motion and degrades to visible content without IntersectionObserver.
 */
let observer: IntersectionObserver | null = null

function getObserver() {
  if (observer || typeof IntersectionObserver === 'undefined') return observer
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      entry.target.classList.add('is-revealed')
      observer?.unobserve(entry.target)
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
  return observer
}

export const reveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const io = getObserver()
    if (reduced || !io) return
    el.classList.add('reveal')
    if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`)
    io.observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  }
}

declare module 'vue' {
  interface GlobalDirectives {
    vReveal: typeof reveal
  }
}
