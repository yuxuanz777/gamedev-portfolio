<template>
  <footer class="footer">
    <div class="footer-ornament" aria-hidden="true"><span>VII</span></div>
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="footer-mark" aria-hidden="true"><span>VII</span></span>
        <div>
          <strong>Seven Zhang / Systems & Worlds</strong>
          <p>{{ t('footer.line') }}</p>
        </div>
      </div>
      <div class="footer-links">
        <a href="https://github.com/yuxuanz777" target="_blank" rel="noopener">GitHub</a>
        <a href="https://linkedin.com/in/yuxuanz777" target="_blank" rel="noopener">LinkedIn</a>
        <a href="https://9tchaser.itch.io" target="_blank" rel="noopener">itch.io</a>
        <router-link to="/contact">{{ t('nav.contact') }}</router-link>
      </div>
    </div>
    <div class="footer-base">
      <span>© {{ year }} Seven (Yuxuan) Zhang</span>
      <span>sevenzhang.com</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from '@/i18n'

const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<style scoped lang="less">
@import '../css/variables.less';

.footer {
  position: relative;
  z-index: 2;
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
  padding: 42px 28px 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
}

.footer-brand { display: flex; align-items: center; gap: 18px; }

.footer-mark {
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  transform: rotate(45deg);
  border: 1px solid rgba(226, 189, 114, 0.5);
}

.footer-mark span { transform: rotate(-45deg); color: @goldBright; font-size: 0.5rem; font-weight: 800; letter-spacing: 0.08em; }

.footer-base {
  max-width: @contentWidth;
  margin: 0 auto;
  padding: 18px 28px 28px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  border-top: 1px solid rgba(150, 205, 177, 0.08);
  color: rgba(156, 169, 159, 0.7);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
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
  font-family: @displayFont;
  font-size: 0.82rem;
  letter-spacing: 0.06em;
}

.footer-links a { position: relative; }
.footer-links a::after { content: ''; position: absolute; left: 0; right: 0; bottom: -4px; height: 1px; background: @tealGlow; transform: scaleX(0); transform-origin: left; transition: transform 240ms ease; }
.footer-links a:hover { color: @tealGlow; }
.footer-links a:hover::after { transform: scaleX(1); }

@media (max-width: 680px) {
  .footer-inner {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
