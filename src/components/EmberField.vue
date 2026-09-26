<template>
  <canvas ref="canvas" class="ember-field" aria-hidden="true"></canvas>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Rising embers and spirit motes drawn on a single canvas.
 * - Pointer pushes nearby particles away (feels like disturbing ash).
 * - Pauses when off-screen or the tab is hidden; disabled for reduced motion.
 */
const props = withDefaults(defineProps<{ density?: number }>(), { density: 1 })

interface Mote {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  life: number
  maxLife: number
  hue: 'ember' | 'spirit'
  wobble: number
}

const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let motes: Mote[] = []
let width = 0
let height = 0
let dpr = 1
let frame = 0
let running = false
let visible = true
const pointer = { x: -9999, y: -9999 }
let resizeObserver: ResizeObserver | null = null
let intersection: IntersectionObserver | null = null

function spawn(initial = false): Mote {
  const spirit = Math.random() < 0.28
  const maxLife = 5 + Math.random() * 7
  return {
    x: Math.random() * width,
    y: initial ? Math.random() * height : height + 10,
    vx: (Math.random() - 0.5) * 12,
    vy: -(14 + Math.random() * (spirit ? 22 : 42)),
    r: spirit ? 0.8 + Math.random() * 1.4 : 0.6 + Math.random() * 1.9,
    life: initial ? Math.random() * maxLife : 0,
    maxLife,
    hue: spirit ? 'spirit' : 'ember',
    wobble: Math.random() * Math.PI * 2
  }
}

function resize() {
  const el = canvas.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = rect.width
  height = rect.height
  el.width = Math.round(width * dpr)
  el.height = Math.round(height * dpr)
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
  const target = Math.round(Math.min(140, (width * height) / 9000) * props.density)
  motes = Array.from({ length: target }, () => spawn(true))
}

let last = 0
function tick(time: number) {
  if (!running) return
  const dt = Math.min((time - (last || time)) / 1000, 0.05)
  last = time
  if (ctx) {
    ctx.clearRect(0, 0, width, height)
    ctx.globalCompositeOperation = 'lighter'
    for (let i = 0; i < motes.length; i++) {
      const m = motes[i]
      m.life += dt
      m.wobble += dt * 1.6
      const dx = m.x - pointer.x
      const dy = m.y - pointer.y
      const dist2 = dx * dx + dy * dy
      if (dist2 < 16000) {
        const force = (1 - dist2 / 16000) * 160
        const d = Math.sqrt(dist2) || 1
        m.vx += (dx / d) * force * dt
        m.vy += (dy / d) * force * dt
      }
      m.vx *= 0.985
      m.x += (m.vx + Math.sin(m.wobble) * 8) * dt
      m.y += m.vy * dt
      if (m.life > m.maxLife || m.y < -20 || m.x < -40 || m.x > width + 40) {
        motes[i] = spawn()
        continue
      }
      const t = m.life / m.maxLife
      const alpha = Math.sin(Math.PI * t) * (m.hue === 'spirit' ? 0.7 : 0.9)
      const glow = m.r * (m.hue === 'spirit' ? 7 : 5)
      const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, glow)
      if (m.hue === 'ember') {
        g.addColorStop(0, `rgba(255, 214, 140, ${alpha})`)
        g.addColorStop(0.25, `rgba(226, 150, 70, ${alpha * 0.55})`)
        g.addColorStop(1, 'rgba(226, 120, 40, 0)')
      } else {
        g.addColorStop(0, `rgba(210, 255, 232, ${alpha})`)
        g.addColorStop(0.3, `rgba(157, 230, 189, ${alpha * 0.4})`)
        g.addColorStop(1, 'rgba(157, 230, 189, 0)')
      }
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(m.x, m.y, glow, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalCompositeOperation = 'source-over'
  }
  frame = requestAnimationFrame(tick)
}

function start() {
  if (running || !visible || document.hidden) return
  running = true
  last = 0
  frame = requestAnimationFrame(tick)
}

function stop() {
  running = false
  cancelAnimationFrame(frame)
}

function onPointerMove(event: PointerEvent) {
  const el = canvas.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  pointer.x = event.clientX - rect.left
  pointer.y = event.clientY - rect.top
}

function onPointerLeave() {
  pointer.x = -9999
  pointer.y = -9999
}

function onVisibility() {
  if (document.hidden) stop()
  else start()
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  ctx = canvas.value?.getContext('2d') ?? null
  if (!ctx || !canvas.value) return
  resize()
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas.value)
  intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) start()
    else stop()
  })
  intersection.observe(canvas.value)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('pointerleave', onPointerLeave)
  document.addEventListener('visibilitychange', onVisibility)
  start()
})

onBeforeUnmount(() => {
  stop()
  resizeObserver?.disconnect()
  intersection?.disconnect()
  window.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerleave', onPointerLeave)
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<style scoped>
.ember-field {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
