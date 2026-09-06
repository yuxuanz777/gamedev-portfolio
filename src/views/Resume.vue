<template>
  <div class="page-shell resume-page">
    <header class="resume-header">
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
          <div class="section-label"><span>01</span>{{ t('resume.experience') }}</div>
          <article class="timeline-item">
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
              <span v-for="skill in ['Combat Design', 'MMO', '3C', 'Skill Systems', 'Cross-functional']" :key="skill">{{ skill }}</span>
            </div>
          </article>

          <article class="timeline-item">
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
              <span v-for="skill in ['Python', 'TensorFlow', 'PyTorch', 'NumPy', 'Linux']" :key="skill">{{ skill }}</span>
            </div>
          </article>
        </section>

        <section class="resume-section">
          <div class="section-label"><span>02</span>{{ t('resume.skills') }}</div>
          <div class="skill-columns">
            <div>
              <h2>{{ t('resume.languages') }}</h2>
              <div class="tag-list large">
                <span v-for="skill in ['C++', 'C#', 'C', 'Java', 'Python', 'MATLAB', 'Verilog']" :key="skill">{{ skill }}</span>
              </div>
            </div>
            <div>
              <h2>{{ t('resume.gamedev') }}</h2>
              <div class="tag-list large">
                <span v-for="skill in ['Unity', 'Unreal Engine 5', 'Gameplay Ability System', 'Computer Graphics', 'Autodesk Maya']" :key="skill">{{ skill }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="resume-section">
          <div class="section-label"><span>03</span>{{ t('resume.education') }}</div>
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
            <div class="section-label"><span>04</span>{{ t('resume.spoken') }}</div>
            <p>{{ t('resume.english') }}</p>
            <p>{{ t('resume.chinese') }}</p>
          </div>
          <div>
            <div class="section-label"><span>05</span>{{ t('resume.beyond') }}</div>
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
.section-label { margin-bottom: 32px; display: flex; align-items: center; gap: 14px; color: @tealGlow; font-family: @displayFont; font-size: 0.78rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; }
.section-label span { color: @goldBright; font-family: @bodyFont; font-size: 0.62rem; }
.timeline-item { position: relative; padding: 30px 32px 30px 42px; border: 1px solid @borderColor; background: rgba(11, 16, 13, 0.72); }
.timeline-item + .timeline-item { margin-top: 44px; }
.timeline-node { position: absolute; left: 18px; top: 36px; width: 8px; height: 8px; transform: rotate(45deg); border: 1px solid @tealGlow; background: @bodyBgColor; box-shadow: 0 0 14px rgba(157, 230, 189, 0.35); }
.timeline-heading { display: flex; justify-content: space-between; gap: 30px; }
.timeline-heading h2, .skill-columns h2, .education-item h2 { font-size: 1.18rem; }
.timeline-heading p, .education-item p { margin: 6px 0 0; color: @mutedText; }
.timeline-heading time { flex: 0 0 auto; color: @tealGlow; font-size: 0.72rem; letter-spacing: 0.08em; }
.timeline-body { margin: 24px 0; color: @mutedText; line-height: 1.85; }
.timeline-points { margin: 24px 0; padding-left: 20px; color: @mutedText; line-height: 1.75; }
.timeline-points li + li { margin-top: 10px; }
.tag-list { display: flex; flex-wrap: wrap; gap: 8px; }
.tag-list span { padding: 5px 9px; border: 1px solid @borderColor; color: @mutedText; background: rgba(157, 230, 189, 0.025); font-size: 0.67rem; letter-spacing: 0.05em; }
.tag-list.large span { padding: 8px 11px; }
.skill-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; }
.skill-columns h2 { margin-bottom: 18px; }
.education-item { padding: 24px 0; display: grid; grid-template-columns: 60px 1fr; gap: 22px; border-bottom: 1px solid @borderColor; }
.crest { position: relative; z-index: 0; width: 56px; height: 56px; display: grid; place-items: center; color: @goldBright; font-size: 0.58rem; }
.crest::before { content: ''; position: absolute; inset: 8px; z-index: -1; transform: rotate(45deg); border: 1px solid rgba(157, 230, 189, 0.4); background: rgba(157, 230, 189, 0.035); }
.education-item strong { display: block; margin-top: 6px; color: @tealGlow; font-size: 0.75rem; font-weight: 500; }
.paired-section { display: grid; grid-template-columns: 1fr 1fr; gap: 54px; border: 0; }
.paired-section p { color: @mutedText; line-height: 1.75; }
.resume-aside { position: sticky; top: 115px; align-self: start; padding: 14px; border: 1px solid @borderColor; background: rgba(11, 16, 13, 0.78); clip-path: polygon(9% 0, 100% 0, 100% 94%, 91% 100%, 0 100%, 0 6%); }
.resume-portrait { aspect-ratio: 1; overflow: hidden; }
.resume-portrait img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 22%; filter: saturate(0.7) contrast(1.05); }
.availability { margin: 15px 0; padding: 12px; display: flex; align-items: center; gap: 9px; color: #b8c9c4; background: rgba(157, 230, 189, 0.07); font-size: 0.7rem; line-height: 1.5; }
.availability i { width: 7px; height: 7px; flex: 0 0 auto; border-radius: 50%; background: @tealGlow; box-shadow: 0 0 10px @tealGlow; }
.resume-aside dl { margin: 0; padding: 4px 8px 10px; }
.resume-aside dl div { padding: 12px 0; border-bottom: 1px solid @borderColor; }
.resume-aside dt { color: @mutedText; font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; }
.resume-aside dd { margin: 4px 0 0; font-size: 0.76rem; overflow-wrap: anywhere; }

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
