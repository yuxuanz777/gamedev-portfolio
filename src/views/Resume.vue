<template>
  <div class="page-shell resume-page">
    <PageAtmosphere />
    <header v-reveal class="resume-header">
      <div class="page-heading">
        <div class="eyebrow">{{ t('resume.eyebrow') }}</div>
        <h1 class="page-title">{{ t('resume.title') }}</h1>
        <p class="page-lead">{{ t('resume.intro') }}</p>
      </div>
      <a class="button-primary" href="/d/resume-en.pdf" target="_blank" rel="noopener">
        <i class="fa fa-download" aria-hidden="true"></i>
        {{ t('common.downloadResume') }}
      </a>
    </header>

    <div class="resume-grid">
      <div class="resume-content">
        <section class="resume-section">
          <div class="section-label">{{ t('resume.experience') }}</div>
          <article v-reveal class="timeline-item is-current">
            <span class="timeline-node" aria-hidden="true"></span>
            <div class="timeline-heading">
              <div>
                <h2>{{ t('resume.neteaseRole') }}</h2>
                <p>{{ t('resume.neteaseOrganization') }}</p>
              </div>
              <time>{{ t('resume.neteasePeriod') }}</time>
            </div>
            <ul class="timeline-points">
              <li>{{ t('resume.neteasePoint1') }}</li>
              <li>{{ t('resume.neteasePoint2') }}</li>
              <li>{{ t('resume.neteasePoint3') }}</li>
            </ul>
            <div class="tag-list">
              <span v-for="(skill, i) in ['Combat Design', 'MMO', '3C', 'Skill Systems', 'Cross-functional']" :key="skill" :style="{ '--n': i }">{{ skill }}</span>
            </div>
          </article>

          <article v-reveal class="timeline-item">
            <span class="timeline-node" aria-hidden="true"></span>
            <div class="timeline-heading">
              <div>
                <h2>{{ t('resume.researchRole') }}</h2>
                <p>{{ t('resume.researchOrganization') }}</p>
              </div>
              <time>{{ t('resume.researchPeriod') }}</time>
            </div>
            <p class="timeline-body">{{ t('resume.researchBody') }}</p>
            <div class="tag-list">
              <span v-for="(skill, i) in ['Python', 'TensorFlow', 'PyTorch', 'NumPy', 'Linux']" :key="skill" :style="{ '--n': i }">{{ skill }}</span>
            </div>
          </article>
        </section>

        <section class="resume-section">
          <div class="section-label">{{ t('resume.skills') }}</div>
          <div v-reveal class="skill-columns">
            <div>
              <h2>{{ t('resume.languages') }}</h2>
              <div class="tag-list large">
                <span v-for="(skill, i) in ['C++', 'C#', 'C', 'Java', 'Python', 'MATLAB', 'Verilog']" :key="skill" :style="{ '--n': i }">{{ skill }}</span>
              </div>
            </div>
            <div>
              <h2>{{ t('resume.gamedev') }}</h2>
              <div class="tag-list large">
                <span v-for="(skill, i) in ['Unity', 'Unreal Engine 5', 'Gameplay Ability System', 'Computer Graphics', 'Autodesk Maya']" :key="skill" :style="{ '--n': i }">{{ skill }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="resume-section">
          <div class="section-label">{{ t('resume.education') }}</div>
          <article class="education-item">
            <span class="crest" aria-hidden="true">USC</span>
            <div><h2>{{ t('resume.usc') }}</h2><strong>{{ t('resume.uscDegree') }}</strong><p>{{ t('resume.uscFocus') }}</p></div>
          </article>
          <article class="education-item">
            <span class="crest" aria-hidden="true">HUST</span>
            <div><h2>{{ t('resume.hust') }}</h2><strong>{{ t('resume.hustDegree') }}</strong><p>{{ t('resume.hustFocus') }}</p></div>
          </article>
        </section>

        <section class="resume-section paired-section">
          <div>
            <div class="section-label">{{ t('resume.spoken') }}</div>
            <p>{{ t('resume.english') }}</p>
            <p>{{ t('resume.chinese') }}</p>
          </div>
          <div>
            <div class="section-label">{{ t('resume.beyond') }}</div>
            <p>{{ t('resume.beyondBody') }}</p>
          </div>
        </section>
      </div>

      <aside class="resume-aside">
        <div class="resume-portrait"><img src="/img/nsh-photo.jpg" alt="Yuxuan Zhang" /></div>
        <div class="availability"><i aria-hidden="true"></i>{{ t('about.quest') }}</div>
        <dl>
          <div><dt>{{ t('resume.emailLabel') }}</dt><dd><a href="mailto:yuxuanz7@usc.edu">yuxuanz7@usc.edu</a></dd></div>
          <div><dt>{{ t('resume.githubLabel') }}</dt><dd><a href="https://github.com/yuxuanz777" target="_blank" rel="noopener">@yuxuanz777</a></dd></div>
          <div><dt>{{ t('resume.locationLabel') }}</dt><dd>{{ t('resume.locationValue') }}</dd></div>
        </dl>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageAtmosphere from '@/components/PageAtmosphere.vue'
import { useI18n } from '@/i18n'
const { t } = useI18n()
</script>

<style scoped lang="less">
@import '../css/variables.less';

.resume-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 40px; margin-bottom: 74px; }
.resume-header .page-heading { margin: 0; }
.resume-header .button-primary { flex: 0 0 auto; }
.resume-grid { display: grid; grid-template-columns: minmax(0, 1fr) 290px; gap: clamp(50px, 8vw, 110px); }
.resume-section { padding: 0 0 66px; margin-bottom: 66px; border-bottom: 1px solid @borderColor; }
.section-label { margin-bottom: 30px; display: flex; align-items: center; gap: 16px; color: @tealGlow; font-family: @displayFont; font-size: 1.05rem; font-weight: 600; letter-spacing: 0.06em; }
.section-label::after { content: ''; flex: 1; max-width: 120px; height: 1px; background: linear-gradient(90deg, rgba(226, 189, 114, 0.5), transparent); }

/* Quest log: a glowing spine joins each role */
.resume-section:first-child { position: relative; }
.timeline-item { position: relative; margin-left: 28px; padding: 30px 32px; border: 1px solid @borderColor; background: linear-gradient(160deg, rgba(16, 23, 19, 0.92), rgba(8, 12, 10, 0.92)); transition: border-color 240ms ease; }
.timeline-item:hover { border-color: rgba(157, 230, 189, 0.4); }
.timeline-item + .timeline-item { margin-top: 36px; }
.timeline-item::before { content: ''; position: absolute; left: -24px; top: 42px; bottom: -70px; width: 1px; background: linear-gradient(180deg, rgba(157, 230, 189, 0.55), rgba(157, 230, 189, 0.08)); }
.timeline-item:last-of-type::before { bottom: 0; background: linear-gradient(180deg, rgba(157, 230, 189, 0.4), transparent); }
.timeline-node { position: absolute; left: -29px; top: 34px; width: 11px; height: 11px; transform: rotate(45deg); border: 1px solid @tealGlow; background: @bodyBgColor; box-shadow: 0 0 14px rgba(157, 230, 189, 0.35); }
.timeline-item.is-current { border-color: rgba(226, 189, 114, 0.35); }
.timeline-item.is-current .timeline-node { border-color: @goldBright; background: @goldBright; box-shadow: 0 0 0 4px rgba(226, 189, 114, 0.15), 0 0 18px rgba(226, 189, 114, 0.7); animation: node-pulse 2.6s ease-in-out infinite; }
.timeline-heading { display: flex; justify-content: space-between; gap: 30px; }
.timeline-heading h2, .skill-columns h2, .education-item h2 { font-size: 1.22rem; }
.timeline-heading p, .education-item p { margin: 6px 0 0; color: @mutedText; }
.timeline-heading time { flex: 0 0 auto; height: fit-content; padding: 4px 10px; border: 1px solid rgba(226, 189, 114, 0.35); color: @goldBright; font-size: 0.82rem; }
.timeline-body { margin: 22px 0; color: @mutedText; line-height: 1.8; }
.timeline-points { margin: 22px 0; padding-left: 20px; color: @mutedText; line-height: 1.75; }
.timeline-points li + li { margin-top: 10px; }
.timeline-points li::marker { color: @goldBright; }
.tag-list { display: flex; flex-wrap: wrap; gap: 7px; }
.tag-list span { padding: 4px 11px; border: 1px solid @borderColor; border-radius: 999px; color: #b8c3bb; background: rgba(157, 230, 189, 0.03); font-size: 0.78rem; }
.tag-list.large span { padding: 7px 14px; font-size: 0.86rem; transition: border-color 200ms ease, color 200ms ease; }
.tag-list.large span:hover { border-color: @tealGlow; color: @headingColor; }
.is-revealed .tag-list span { animation: tag-light 900ms ease both; animation-delay: calc(var(--n, 0) * 60ms + 200ms); }
@keyframes tag-light { 0% { opacity: 0; transform: translateY(6px); } 60% { opacity: 1; border-color: @goldBright; box-shadow: 0 0 14px rgba(226, 189, 114, 0.35); } 100% { opacity: 1; transform: none; } }
@supports (animation-timeline: view()) {
  .timeline-item::before { transform-origin: top; animation: spine-fill linear both; animation-timeline: view(); animation-range: entry 20% cover 60%; }
  @keyframes spine-fill { from { transform: scaleY(0); } to { transform: scaleY(1); } }
}
@media (prefers-reduced-motion: reduce) { .is-revealed .tag-list span, .timeline-item::before { animation: none; } }
.skill-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; }
.skill-columns h2 { margin-bottom: 18px; }
.education-item { padding: 24px 0; display: grid; grid-template-columns: 60px 1fr; gap: 22px; border-bottom: 1px solid @borderColor; }
.crest { position: relative; z-index: 0; width: 56px; height: 56px; display: grid; place-items: center; color: @goldBright; font-size: 0.58rem; }
.crest::before { content: ''; position: absolute; inset: 8px; z-index: -1; transform: rotate(45deg); border: 1px solid rgba(157, 230, 189, 0.4); background: rgba(157, 230, 189, 0.035); }
.education-item strong { display: block; margin-top: 6px; color: @tealGlow; font-size: 0.88rem; font-weight: 500; }
.paired-section { display: grid; grid-template-columns: 1fr 1fr; gap: 54px; border: 0; }
.paired-section p { color: @mutedText; line-height: 1.75; }
.resume-aside { position: sticky; top: 115px; align-self: start; padding: 14px; border: 1px solid rgba(226, 189, 114, 0.26); background: rgba(11, 16, 13, 0.85); box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4); }
.resume-aside::before, .resume-aside::after { content: ''; position: absolute; width: 34px; height: 34px; border: solid @goldBright; pointer-events: none; }
.resume-aside::before { top: -5px; left: -5px; border-width: 1px 0 0 1px; }
.resume-aside::after { right: -5px; bottom: -5px; border-width: 0 1px 1px 0; }
.resume-portrait { aspect-ratio: 1; overflow: hidden; }
.resume-portrait img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 22%; filter: saturate(0.8) contrast(1.05); transition: transform 800ms cubic-bezier(.2,.7,.2,1); }
.resume-aside:hover .resume-portrait img { transform: scale(1.04); }
.availability { margin: 15px 0; padding: 12px; display: flex; align-items: center; gap: 9px; color: #b8c9c4; background: rgba(157, 230, 189, 0.07); font-size: 0.82rem; line-height: 1.5; }
.availability i { width: 7px; height: 7px; flex: 0 0 auto; border-radius: 50%; background: @tealGlow; box-shadow: 0 0 10px @tealGlow; }
.resume-aside dl { margin: 0; padding: 4px 8px 10px; }
.resume-aside dl div { padding: 12px 0; border-bottom: 1px solid @borderColor; }
.resume-aside dt { color: @mutedText; font-family: @displayFont; font-size: 0.74rem; letter-spacing: 0.06em; }
.resume-aside dd { margin: 4px 0 0; font-size: 0.9rem; overflow-wrap: anywhere; }

@keyframes node-pulse { 50% { box-shadow: 0 0 0 7px rgba(226, 189, 114, 0.05), 0 0 26px rgba(226, 189, 114, 0.9); } }
@media (prefers-reduced-motion: reduce) { .timeline-item.is-current .timeline-node { animation: none; } }

@media (max-width: 900px) {
  .resume-grid { grid-template-columns: 1fr; }
  .resume-aside { position: static; width: min(100%, 360px); grid-row: 1; }
}
@media (max-width: 650px) {
  .resume-header { align-items: flex-start; flex-direction: column; margin-bottom: 52px; }
  .timeline-heading, .skill-columns, .paired-section { grid-template-columns: 1fr; flex-direction: column; }
  .skill-columns, .paired-section { display: grid; gap: 36px; }
}
</style>
