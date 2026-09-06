<template>
  <footer class="footer">
    <div class="footer-ornament" aria-hidden="true"><span>VII</span></div>
    <div class="footer-inner">
      <div>
        <strong>Seven Zhang / Systems & Worlds</strong>
        <p>{{ t('footer.line') }}</p>
      </div>
      <div class="footer-links">
        <a href="https://github.com/yuxuanz777" target="_blank" rel="noopener">GitHub</a>
        <a href="https://linkedin.com/in/yuxuanz777" target="_blank" rel="noopener">LinkedIn</a>
        <a href="https://9tchaser.itch.io" target="_blank" rel="noopener">itch.io</a>
        <router-link to="/contact">{{ t('nav.contact') }}</router-link>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from '@/i18n'

const { t } = useI18n()
</script>

<style scoped lang="less">
@import '../css/variables.less';

.footer {
  position: relative;
  margin-top: 80px;
  border-top: 1px solid @borderColor;
  background: rgba(5, 8, 6, 0.82);
}

.footer-ornament {
  position: absolute;
  left: 50%;
  top: 0;
  width: 110px;
  height: 1px;
  background: linear-gradient(90deg, transparent, @tealGlow, transparent);
  transform: translateX(-50%);
}

.footer-ornament span {
  position: absolute;
  left: 50%;
  top: 0;
  color: @tealGlow;
  font-size: 7px;
  font-weight: 800;
  letter-spacing: 0.1em;
  transform: translate(-50%, -50%);
}

.footer-inner {
  max-width: @contentWidth;
  margin: 0 auto;
  padding: 42px 28px 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
}

.footer strong {
  color: @tealGlow;
  font-family: @displayFont;
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.footer p {
  margin: 5px 0 0;
  color: @mutedText;
  font-size: 0.78rem;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
}

.footer-links a {
  color: @mutedText;
  opacity: 1;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.footer-links a:hover { color: @tealGlow; }

@media (max-width: 680px) {
  .footer-inner {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
