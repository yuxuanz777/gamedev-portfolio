import type { Directive } from 'vue'

/**
 * v-tilt: gives a card a subtle 3D lean toward the pointer and exposes
 * --mouse-x / --mouse-y so the card's own spotlight can follow as a glare.
 * Only active for fine pointers without a reduced-motion preference.
 */
interface TiltElement extends HTMLElement {
  __tiltCleanup?: () => void
}

export const tilt: Directive<TiltElement, number | undefined> = {
  mounted(el, binding) {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!canHover || reduced) return
    const max = binding.value ?? 5
    let frame = 0

    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const px = (event.clientX - rect.left) / rect.width
        const py = (event.clientY - rect.top) / rect.height
        el.style.setProperty('--mouse-x', `${px * rect.width}px`)
        el.style.setProperty('--mouse-y', `${py * rect.height}px`)
        el.style.transition = 'transform 120ms ease-out, box-shadow 400ms ease, border-color 240ms ease'
        el.style.transform = `perspective(1100px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translateY(-4px)`
      })
    }
    const leave = () => {
      cancelAnimationFrame(frame)
      el.style.transition = 'transform 600ms cubic-bezier(.2,.7,.2,1), box-shadow 400ms ease, border-color 240ms ease'
      el.style.transform = ''
    }

    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    el.__tiltCleanup = () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  },
  unmounted(el) {
    el.__tiltCleanup?.()
  }
}

declare module 'vue' {
  interface GlobalDirectives {
    vTilt: typeof tilt
  }
}
