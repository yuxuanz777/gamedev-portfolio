import { readonly, ref } from 'vue'

/**
 * Tiny synthesized sound palette (Web Audio, no audio files).
 * Off by default; the visitor turns it on from the header and the choice is remembered.
 */
export type SfxName = 'hover' | 'select' | 'cast' | 'open' | 'close' | 'page' | 'enable' | 'filter'

const STORAGE_KEY = 'portfolio-sound'
const enabled = ref(false)
try {
  enabled.value = localStorage.getItem(STORAGE_KEY) === 'on'
} catch {
  enabled.value = false
}

let ctx: AudioContext | null = null
let master: GainNode | null = null
let noiseBuffer: AudioBuffer | null = null

function audio() {
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
    const compressor = ctx.createDynamicsCompressor()
    compressor.threshold.value = -18
    compressor.ratio.value = 6
    master = ctx.createGain()
    master.gain.value = 0.55
    master.connect(compressor)
    compressor.connect(ctx.destination)
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tone(freq: number, start: number, dur: number, peak: number, type: OscillatorType = 'sine', endFreq?: number) {
  if (!ctx || !master) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, start + dur)
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  osc.connect(gain)
  gain.connect(master)
  osc.start(start)
  osc.stop(start + dur + 0.05)
}

function noise(start: number, dur: number, peak: number, from: number, to: number, q = 1.2) {
  if (!ctx || !master || !noiseBuffer) return
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.Q.value = q
  filter.frequency.setValueAtTime(from, start)
  filter.frequency.exponentialRampToValueAtTime(to, start + dur)
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(peak, start + dur * 0.35)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  src.connect(filter)
  filter.connect(gain)
  gain.connect(master)
  src.start(start)
  src.stop(start + dur + 0.05)
}

const recipes: Record<SfxName, (t: number) => void> = {
  hover: t => tone(2200, t, 0.05, 0.025, 'sine', 1500),
  select: t => {
    tone(880, t, 0.18, 0.07, 'triangle')
    tone(1320, t + 0.01, 0.22, 0.045)
    noise(t, 0.05, 0.05, 5000, 3000, 2)
  },
  filter: t => {
    tone(660, t, 0.12, 0.05, 'triangle', 990)
  },
  cast: t => {
    noise(t, 0.42, 0.16, 300, 2600, 0.9)
    tone(659, t + 0.12, 0.5, 0.05, 'sine')
    tone(988, t + 0.2, 0.55, 0.045, 'sine')
    tone(1319, t + 0.28, 0.6, 0.03, 'sine')
  },
  open: t => {
    tone(70, t, 0.6, 0.18, 'sine', 45)
    noise(t, 0.5, 0.08, 200, 1800, 0.8)
    ;[440, 659, 880, 1109, 1319].forEach((f, i) => tone(f, t + 0.06 + i * 0.055, 0.7, 0.04, 'triangle'))
  },
  close: t => {
    noise(t, 0.22, 0.06, 1800, 300, 0.9)
    tone(660, t, 0.2, 0.03, 'triangle', 330)
  },
  page: t => {
    noise(t, 0.3, 0.05, 500, 2200, 0.7)
  },
  enable: t => {
    ;[523, 784, 1047].forEach((f, i) => tone(f, t + i * 0.07, 0.4, 0.05, 'triangle'))
  }
}

let lastPlay = 0
export function playSfx(name: SfxName, force = false) {
  if (!enabled.value && !force) return
  const now = performance.now()
  if (name === 'hover' && now - lastPlay < 70) return
  lastPlay = now
  const c = audio()
  if (!c) return
  recipes[name](c.currentTime + 0.005)
}

export function setSoundEnabled(value: boolean) {
  enabled.value = value
  try {
    localStorage.setItem(STORAGE_KEY, value ? 'on' : 'off')
  } catch {
    // Storage can be unavailable (private mode); the toggle still works for this visit.
  }
  if (value) playSfx('enable', true)
}

/** Delegated hover/click sounds for every link and button on the page. */
export function installUiSounds() {
  let lastTarget: Element | null = null
  document.addEventListener('pointerover', (event) => {
    if (!enabled.value || (event as PointerEvent).pointerType === 'touch') return
    const target = (event.target as Element | null)?.closest('a, button, [data-sfx]')
    if (target && target !== lastTarget) playSfx('hover')
    lastTarget = target ?? null
  }, { passive: true })
  document.addEventListener('click', (event) => {
    const target = (event.target as Element | null)?.closest('a, button')
    if (target && !target.hasAttribute('data-sfx-silent')) playSfx('select')
  }, { passive: true })
}

export function useSound() {
  return { soundEnabled: readonly(enabled), setSoundEnabled, playSfx }
}
