<template>
  <div class="rune-circle" :class="{ 'rune-circle--static': reduced }" aria-hidden="true">
    <svg class="rune-svg" viewBox="0 0 600 600">
      <defs>
        <path id="rune-text-path" d="M300,300 m-252,0 a252,252 0 1,1 504,0 a252,252 0 1,1 -504,0" />
        <path id="rune-text-path-inner" d="M300,300 m-176,0 a176,176 0 1,1 352,0 a176,176 0 1,1 -352,0" />
        <radialGradient id="rune-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(157,230,189,0.24)" />
          <stop offset="55%" stop-color="rgba(157,230,189,0.05)" />
          <stop offset="100%" stop-color="rgba(157,230,189,0)" />
        </radialGradient>
        <linearGradient id="rune-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f4dca3" />
          <stop offset="100%" stop-color="#a87b3c" />
        </linearGradient>
      </defs>

      <circle cx="300" cy="300" r="290" fill="url(#rune-core)" />

      <!-- Outer ring: ticks + engraved words -->
      <g class="ring ring--outer">
        <circle cx="300" cy="300" r="284" class="stroke-gold thin" />
        <circle cx="300" cy="300" r="274" class="stroke-gold ticks" />
        <circle cx="300" cy="300" r="232" class="stroke-teal thin" />
        <text class="rune-text">
          <textPath href="#rune-text-path" startOffset="0">
            SEVEN ✦ SYSTEMS ✦ WORLDS ✦ COMBAT ✦ CRAFT ✦ VII ✦ SEVEN ✦ SYSTEMS ✦ WORLDS ✦ COMBAT ✦ CRAFT ✦ VII ✦
          </textPath>
        </text>
      </g>

      <!-- Middle ring: counter-rotating glyph band -->
      <g class="ring ring--middle">
        <circle cx="300" cy="300" r="196" class="stroke-teal dashed" />
        <text class="rune-text rune-text--small">
          <textPath href="#rune-text-path-inner" startOffset="0">
            ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛞ ᛟ ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ
          </textPath>
        </text>
        <circle cx="300" cy="300" r="158" class="stroke-gold thin" />
      </g>

      <!-- Inner sigil: two interlocked triangles and orbiting nodes -->
      <g class="ring ring--inner">
        <polygon points="300,150 430,375 170,375" class="stroke-gold sigil" />
        <polygon points="300,450 170,225 430,225" class="stroke-teal sigil" />
        <circle cx="300" cy="150" r="5" class="node" />
        <circle cx="430" cy="375" r="5" class="node" />
        <circle cx="170" cy="375" r="5" class="node" />
      </g>
    </svg>

    <div class="rune-core">
      <img
        v-for="(item, index) in items"
        :key="item.src"
        :src="item.src"
        alt=""
        :class="{ active: index === active }"
        width="512"
        height="512"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{ items: { src: string }[] }>()
const active = ref(0)
const reduced = ref(false)
let timer = 0

onMounted(() => {
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced.value || props.items.length < 2) return
  timer = window.setInterval(() => {
    active.value = (active.value + 1) % props.items.length
  }, 3600)
})

onBeforeUnmount(() => window.clearInterval(timer))
</script>

<style scoped>
.rune-circle {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
}

.rune-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  filter: drop-shadow(0 0 18px rgba(157, 230, 189, 0.18));
}

.ring { transform-origin: 300px 300px; transform-box: view-box; }
.ring--outer { animation: rune-spin 90s linear infinite; }
.ring--middle { animation: rune-spin 60s linear infinite reverse; }
.ring--inner { animation: rune-spin 40s linear infinite; }

.stroke-gold { fill: none; stroke: url(#rune-gold); }
.stroke-teal { fill: none; stroke: rgba(157, 230, 189, 0.45); }
.thin { stroke-width: 1; opacity: 0.7; }
.ticks { stroke-width: 7; stroke-dasharray: 1 11.2; opacity: 0.5; }
.dashed { stroke-width: 1; stroke-dasharray: 4 8; }
.sigil { stroke-width: 1.2; opacity: 0.55; }
.node { fill: #f4dca3; filter: drop-shadow(0 0 6px #e2bd72); }

.rune-text {
  fill: rgba(226, 189, 114, 0.78);
  font-family: 'Cinzel', Georgia, serif;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 6.2px;
}

.rune-text--small {
  fill: rgba(157, 230, 189, 0.6);
  font-family: 'Segoe UI Historic', 'Noto Sans Runic', 'Segoe UI Symbol', serif;
  font-size: 15px;
  letter-spacing: 6px;
}

.rune-core {
  position: absolute;
  inset: 28%;
  border-radius: 50%;
}

.rune-core::before {
  content: '';
  position: absolute;
  inset: -12%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(157, 230, 189, 0.22), transparent 66%);
  animation: rune-breathe 4.8s ease-in-out infinite;
}

.rune-core img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0;
  transform: scale(0.9);
  filter: drop-shadow(0 12px 30px rgba(0, 0, 0, 0.7)) saturate(1.05);
  transition: opacity 1.1s ease, transform 1.4s cubic-bezier(.2, .7, .2, 1);
}

.rune-core img.active { opacity: 1; transform: scale(1); }

.rune-circle--static .ring,
.rune-circle--static .rune-core::before { animation: none; }

@keyframes rune-spin { to { transform: rotate(360deg); } }
@keyframes rune-breathe { 50% { opacity: 0.45; transform: scale(0.94); } }
</style>
