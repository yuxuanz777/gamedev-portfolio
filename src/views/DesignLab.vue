<template>
  <div class="design-lab">
    <header class="lab-toolbar">
      <div class="lab-title">
        <strong>本地设计实验室</strong>
        <span>仅开发环境可见 · 不会进入发布构建</span>
      </div>

      <div class="lab-options" role="tablist" aria-label="选择设计方案">
        <button
          v-for="option in options"
          :key="option.id"
          type="button"
          role="tab"
          :aria-selected="selected === option.id"
          :class="{ active: selected === option.id }"
          @click="selectConcept(option.id)"
        >
          <b>{{ option.index }}</b>
          <span>{{ option.name }}</span>
        </button>
      </div>

      <div class="lab-actions">
        <button type="button" @click="toggleLocale">{{ locale === 'zh' ? 'EN' : '中文' }}</button>
        <router-link to="/">退出预览</router-link>
      </div>
    </header>

    <aside class="lab-note">
      <span>{{ activeOption.index }}</span>
      <div>
        <strong>{{ activeOption.name }}</strong>
        <p>{{ activeOption.note }}</p>
      </div>
    </aside>

    <div class="lab-canvas">
      <component :is="activeComponent" :locale="locale" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/i18n'
import ReferoConcept from '@/design-lab/ReferoConcept.vue'
import StudioConcept from '@/design-lab/StudioConcept.vue'
import KineticConcept from '@/design-lab/KineticConcept.vue'
import type { LabLocale } from '@/design-lab/content'

type ConceptId = 'a' | 'b' | 'c'

const options = [
  {
    id: 'a' as const,
    index: 'A',
    name: '叙事型作品集',
    note: '保留暗色奇幻气质，用编辑式排版、真实项目画面和克制的金色细节，让作品更像一本被精心编排的创作档案。',
    component: ReferoConcept
  },
  {
    id: 'b' as const,
    index: 'B',
    name: '招聘型设计档案',
    note: '高对比浅色方案，把身份、网易经历与代表作压缩进快速扫描路径，最适合招聘者在短时间内判断匹配度。',
    component: StudioConcept
  },
  {
    id: 'c' as const,
    index: 'C',
    name: '沉浸型战斗界面',
    note: '在现有幻想世界观上增强光标聚光、磁吸按钮和分层动效；交互来自 React Bits 当前源码，并已按 Vue 架构重写。',
    component: KineticConcept
  }
]

const route = useRoute()
const router = useRouter()
const { locale: siteLocale, toggleLocale } = useI18n()
const queryConcept = route.query.concept
const selected = ref<ConceptId>(queryConcept === 'b' || queryConcept === 'c' ? queryConcept : 'a')
const locale = computed(() => siteLocale.value as LabLocale)
const activeOption = computed(() => options.find((option) => option.id === selected.value) ?? options[0])
const activeComponent = computed(() => activeOption.value.component)

function selectConcept(concept: ConceptId) {
  selected.value = concept
  void router.replace({ query: { ...route.query, concept } })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.design-lab {
  min-height: 100vh;
  background: #111310;
}

.lab-toolbar {
  position: sticky;
  top: 0;
  z-index: 80;
  min-height: 66px;
  padding: 9px 16px;
  display: grid;
  grid-template-columns: minmax(190px, 1fr) auto minmax(190px, 1fr);
  align-items: center;
  gap: 16px;
  color: #efeee9;
  border-bottom: 1px solid rgba(255, 255, 255, 0.11);
  background: rgba(17, 19, 16, 0.94);
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(16px);
  font-family: Inter, "Noto Sans SC", "Microsoft YaHei", sans-serif;
}

.lab-title { display: flex; flex-direction: column; gap: 3px; }
.lab-title strong { font-size: 0.78rem; letter-spacing: 0.04em; }
.lab-title span { color: #92978e; font-size: 0.65rem; letter-spacing: 0.03em; }

.lab-options {
  display: flex;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.035);
}
.lab-options button,
.lab-actions button,
.lab-actions a {
  min-height: 38px;
  border: 0;
  color: #aeb2aa;
  background: transparent;
  font: inherit;
  font-size: 0.7rem;
  cursor: pointer;
}
.lab-options button { padding: 0 13px; display: flex; align-items: center; gap: 7px; border-radius: 6px; transition: color 120ms ease-out, background-color 120ms ease-out; }
.lab-options button b { color: #caae70; font-size: 0.62rem; }
.lab-options button:hover { color: #f6f4ec; }
.lab-options button.active { color: #10130f; background: #d4bd82; }
.lab-options button.active b { color: #10130f; }

.lab-actions { justify-self: end; display: flex; align-items: center; gap: 8px; }
.lab-actions button,
.lab-actions a { padding: 0 12px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid rgba(255, 255, 255, 0.13); border-radius: 6px; }
.lab-actions button:hover,
.lab-actions a:hover { color: #f5f2e8; border-color: rgba(212, 189, 130, 0.58); }

.lab-note {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 60;
  width: min(390px, calc(100% - 36px));
  padding: 15px 16px;
  display: grid;
  grid-template-columns: 30px 1fr;
  gap: 12px;
  color: #efeee9;
  border: 1px solid rgba(212, 189, 130, 0.25);
  border-radius: 8px;
  background: rgba(14, 16, 13, 0.91);
  box-shadow: 0 16px 45px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(14px);
  font-family: Inter, "Noto Sans SC", "Microsoft YaHei", sans-serif;
}
.lab-note > span { width: 28px; height: 28px; display: grid; place-items: center; color: #10130f; border-radius: 50%; background: #d4bd82; font-size: 0.68rem; font-weight: 800; }
.lab-note strong { font-size: 0.76rem; }
.lab-note p { margin: 5px 0 0; color: #a7aaa3; font-size: 0.68rem; line-height: 1.55; }
.lab-canvas { min-height: calc(100vh - 66px); }

@media (max-width: 940px) {
  .lab-toolbar { grid-template-columns: 1fr auto; }
  .lab-title { display: none; }
  .lab-options { justify-self: start; }
}

@media (max-width: 660px) {
  .lab-toolbar { padding: 8px; gap: 8px; }
  .lab-options button { padding: 0 11px; }
  .lab-options button span { display: none; }
  .lab-actions a { display: none; }
  .lab-note { bottom: 10px; right: 10px; width: calc(100% - 20px); }
}

@media (prefers-reduced-motion: reduce) {
  .lab-options button { transition-duration: 0.01ms; }
}
</style>
