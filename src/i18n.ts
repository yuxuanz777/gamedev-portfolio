import { readonly, ref, watch } from 'vue'

export type Locale = 'en' | 'zh'

interface Dictionary {
  [key: string]: string | Dictionary
}

const translations: Record<Locale, Dictionary> = {
  en: {
    nav: {
      about: 'About',
      games: 'Games',
      other: 'Other Works',
      resume: 'Resume',
      contact: 'Contact'
    },
    common: {
      brandRole: 'Game Designer & Developer',
      language: '中文',
      languageLabel: 'Switch language to Chinese',
      viewWork: 'View my work',
      contactMe: 'Contact me',
      viewDetails: 'View details',
      close: 'Close',
      all: 'All',
      downloadResume: 'Download resume',
      current: 'Current',
      copy: 'Copy email',
      copied: 'Email copied',
      skip: 'Skip to content'
    },
    about: {
      eyebrow: 'Combat designer · game developer · independent world creator',
      title: 'I forge playable worlds from code, systems, and imagination.',
      lead: 'Hi, I’m Seven (Yuxuan) Zhang, an MSCS student at USC focused on game design & development. I build responsive combat, expressive mechanics, and the technology that makes imagined worlds feel real.',
      quest: 'Seeking game design & development opportunities',
      location: 'Los Angeles · Available worldwide',
      gamesStat: 'Game projects',
      enginesStat: 'Game engines',
      researchStat: 'Research paper',
      industryEyebrow: 'Industry experience',
      industryRole: 'NetEase Leihuo · Combat Designer Intern',
      industryProject: 'Justice Online Mobile · MMO project',
      industryBody: 'Designed and configured combat skills, coordinated animation, VFX, audio, and technical integration, and tuned 3C and frame data through internal and core-player testing.',
      introEyebrow: 'Introduction',
      pathTitle: 'My path',
      pathBody: 'My journey began in biomedical engineering and AI medical imaging. I crossed disciplines to pursue game development—bringing research discipline, systems thinking, and a love of fantasy worlds into every project. I also bring industry experience as a Combat Designer Intern on NetEase Leihuo’s MMO project, Justice Online Mobile, alongside hands-on independent development in Unity and Unreal Engine.',
      craftEyebrow: 'Arsenal',
      craftTitle: 'What I craft',
      craft1Title: 'Gameplay Systems',
      craft1Body: 'Combat, movement, abilities, progression, save systems, and the small interactions that make play feel responsive.',
      craft2Title: 'Engine Work',
      craft2Body: 'C++, rendering optimization, animation pipelines, physics components, and practical tools for faster iteration.',
      craft3Title: 'Intelligent Systems',
      craft3Body: 'AI-informed research and gameplay logic, backed by experience with Python, TensorFlow, and data-driven problem solving.',
      featuredEyebrow: 'Selected work',
      featuredTitle: 'Featured quests',
      featuredLead: 'A selection of worlds, systems, and experiments I have brought to life.'
    },
    games: {
      eyebrow: 'Crafted Worlds',
      title: 'Game Projects',
      intro: 'Game jam experiments and long-form personal projects built with Unity, Unreal Engine, C#, and C++.'
    },
    other: {
      eyebrow: 'Beyond the Realm',
      title: 'Other Works',
      intro: 'Engine development, compact game experiments, and AI medical imaging research—different disciplines connected by systems thinking.'
    },
    resume: {
      eyebrow: 'The Adventurer’s Record',
      title: 'Resume',
      intro: 'Game developer and USC computer science graduate student with a foundation in software engineering, game systems, and AI research.',
      experience: 'Experience',
      neteaseRole: 'Combat Designer Intern',
      neteaseOrganization: 'NetEase Leihuo · Justice Online Mobile · MMO Project',
      neteasePeriod: 'Feb 2026 — Aug 2026',
      neteasePoint1: 'Designed two combat skills for an upcoming version and completed the full skill-logic configuration; both entered player testing and final pre-release iteration.',
      neteasePoint2: 'Coordinated animation, VFX, audio, and technical integration end to end, then polished action feel and visual tension through frame-data and hit-stop tuning.',
      neteasePoint3: 'Contributed to protagonist 3C reconstruction, mechanic improvements, and numerical adjustments for existing skills to strengthen competitive combat.',
      researchRole: 'AI Medical Imaging Research Assistant',
      researchOrganization: 'Northwestern University · Remote',
      researchPeriod: 'Jun 2024 — May 2025',
      researchBody: 'Collaborated with AIMP-Lab on accelerated MRI reconstruction. Built a dual-domain, multi-path, self-supervised diffusion pipeline with Python and TensorFlow, contributing to a manuscript currently under review.',
      skills: 'Skills & Tools',
      languages: 'Programming',
      gamedev: 'Game Development',
      education: 'Education',
      usc: 'University of Southern California',
      uscDegree: 'M.S. in Computer Science · Expected 2027',
      uscFocus: 'Software engineering and game development',
      hust: 'Huazhong University of Science and Technology',
      hustDegree: 'B.Eng. in Biomedical Engineering · 2025',
      hustFocus: 'AI medical imaging and interdisciplinary research',
      spoken: 'Languages',
      english: 'English · Professional proficiency · TOEFL iBT 100',
      chinese: 'Chinese · Native',
      beyond: 'Beyond code',
      beyondBody: 'Fantasy games, literature, cinema, and distance running. I completed a half marathon during my undergraduate years.',
      emailLabel: 'Email',
      githubLabel: 'GitHub',
      locationLabel: 'Location',
      locationValue: 'Los Angeles, CA'
    },
    contact: {
      eyebrow: 'Send a Raven',
      title: 'Let’s create something memorable.',
      intro: 'I’m always glad to talk about game development, engine technology, research, literature, or a new opportunity.',
      emailTitle: 'Email',
      socialTitle: 'Find me across the realms',
      availability: 'Open to game development opportunities and collaborations.',
      response: 'Replies within 24 hours.'
    },
    footer: {
      line: 'Forged with Vue, TypeScript, and an unreasonable love of games.',
      source: 'Original portfolio template'
    },
    projects: {
      filter: 'Filter by craft',
      empty: 'No quests match this path.',
      dialogLabel: 'Project details'
    },
    notFound: {
      title: 'The path is lost',
      body: 'This road fades into the fog. Return to the known realm.',
      action: 'Return home'
    }
  },
  zh: {
    nav: {
      about: '关于我',
      games: '游戏作品',
      other: '其他项目',
      resume: '个人简历',
      contact: '联系方式'
    },
    common: {
      brandRole: '游戏策划与开发者',
      language: 'EN',
      languageLabel: '切换语言为英文',
      viewWork: '查看作品',
      contactMe: '联系我',
      viewDetails: '查看详情',
      close: '关闭',
      all: '全部',
      downloadResume: '下载英文简历',
      current: '当前',
      copy: '复制邮箱',
      copied: '邮箱已复制',
      skip: '跳到主要内容'
    },
    about: {
      eyebrow: '战斗策划 · 游戏开发者 · 独立世界构筑者',
      title: '以代码、系统与想象力，锻造可以亲身踏入的世界。',
      lead: '我是张宇瑄，南加州大学计算机科学硕士研究生，专注于游戏开发。我热衷于打造富有反馈的战斗、具有表现力的玩法机制，以及让幻想世界真正运转起来的技术。',
      quest: '正在寻找游戏开发相关机会',
      location: '洛杉矶 · 接受全球合作',
      gamesStat: '游戏项目',
      enginesStat: '游戏引擎',
      researchStat: '研究论文',
      industryEyebrow: '行业经历',
      industryRole: '网易雷火 · 战斗策划实习生',
      industryProject: '《逆水寒》手游 · MMO 项目',
      industryBody: '负责战斗技能设计与完整逻辑配置，协调动画、特效、音频与技术接入，并通过内部和核心玩家测试打磨 3C、帧数据与打击停顿。',
      introEyebrow: '个人介绍',
      pathTitle: '我的旅程',
      pathBody: '我的旅程始于生物医学工程与 AI 医学影像研究，随后跨越学科边界投身游戏开发。严谨的研究方法、系统思维，以及对奇幻世界的热爱，共同塑造了我今天的创作方式。我还曾在网易雷火《逆水寒》手游 MMO 项目担任战斗策划实习生，并持续使用 Unity 与 Unreal Engine 进行独立开发。',
      craftEyebrow: '技能专长',
      craftTitle: '我的专长',
      craft1Title: '玩法系统',
      craft1Body: '战斗、移动、技能、成长、存档，以及让操作变得灵敏而可信的每一个细节。',
      craft2Title: '引擎开发',
      craft2Body: 'C++、渲染优化、动画管线、物理组件，以及帮助团队快速迭代的实用工具。',
      craft3Title: '智能系统',
      craft3Body: '结合 AI 研究与游戏逻辑，运用 Python、TensorFlow 和数据驱动方法解决复杂问题。',
      featuredEyebrow: '精选作品',
      featuredTitle: '精选任务',
      featuredLead: '一些由我亲手赋予生命的世界、系统与实验。'
    },
    games: {
      eyebrow: '我所锻造的世界',
      title: '游戏作品',
      intro: '使用 Unity、Unreal Engine、C# 与 C++ 制作的 Game Jam 实验和长期个人项目。'
    },
    other: {
      eyebrow: '疆界之外',
      title: '其他项目',
      intro: '游戏引擎开发、小型游戏实验与 AI 医学影像研究——以系统思维连接不同领域。'
    },
    resume: {
      eyebrow: '冒险者履历',
      title: '个人简历',
      intro: '南加州大学计算机科学硕士研究生，专注游戏开发，具备软件工程、游戏系统和 AI 研究背景。',
      experience: '工作经历',
      neteaseRole: '战斗策划实习生',
      neteaseOrganization: '网易雷火 · 《逆水寒》手游 · MMO 项目',
      neteasePeriod: '2026 年 2 月 — 2026 年 8 月',
      neteasePoint1: '为后续版本设计两项战斗技能并完成完整技能逻辑配置，现已进入玩家测试与上线前最终迭代。',
      neteasePoint2: '端到端协调动画、特效、音频与技术接入，并通过帧数据和打击停顿调优动作手感与视觉张力。',
      neteasePoint3: '参与新版本主角 3C 重构，规划既有技能的机制优化与数值调整，提升竞技战斗体验。',
      researchRole: 'AI 医学影像研究助理',
      researchOrganization: '西北大学 · 远程',
      researchPeriod: '2024 年 6 月 — 2025 年 5 月',
      researchBody: '与 AIMP-Lab 合作开展快速 MRI 重建研究，使用 Python 和 TensorFlow 构建双域、多路径、自监督扩散模型，并参与完成目前在审的研究论文。',
      skills: '技能与工具',
      languages: '编程语言',
      gamedev: '游戏开发',
      education: '教育经历',
      usc: '南加州大学',
      uscDegree: '计算机科学硕士 · 预计 2027 年毕业',
      uscFocus: '软件工程与游戏开发方向',
      hust: '华中科技大学',
      hustDegree: '生物医学工程学士 · 2025 年',
      hustFocus: 'AI 医学影像与交叉学科研究',
      spoken: '语言能力',
      english: '英语 · 专业工作水平 · 托福 100',
      chinese: '中文 · 母语',
      beyond: '代码之外',
      beyondBody: '热爱奇幻游戏、文学、电影和长跑，本科期间完成过半程马拉松。',
      emailLabel: '电子邮箱',
      githubLabel: 'GitHub',
      locationLabel: '所在地',
      locationValue: '美国加州洛杉矶'
    },
    contact: {
      eyebrow: '寄出渡鸦',
      title: '让我们一起创造值得记住的作品。',
      intro: '无论是游戏开发、引擎技术、科研、文学，还是新的合作机会，我都很乐意与你交流。',
      emailTitle: '电子邮箱',
      socialTitle: '在各个世界找到我',
      availability: '目前开放游戏开发岗位与项目合作机会。',
      response: '通常会在 48 小时内回复。'
    },
    footer: {
      line: '由 Vue、TypeScript 与对游戏不讲道理的热爱共同锻造。',
      source: '原始作品集模板'
    },
    projects: {
      filter: '按技艺筛选',
      empty: '这条道路上暂时没有任务。',
      dialogLabel: '项目详情'
    },
    notFound: {
      title: '道路已迷失',
      body: '这条路消失在迷雾之中，请返回已知的世界。',
      action: '返回首页'
    }
  }
}

const savedLocale = localStorage.getItem('portfolio-locale')
const locale = ref<Locale>(savedLocale === 'zh' ? 'zh' : 'en')

function resolve(dictionary: Dictionary, path: string): string | undefined {
  const value = path.split('.').reduce<string | Dictionary | undefined>((current, key) => {
    return typeof current === 'object' ? current[key] : undefined
  }, dictionary)
  return typeof value === 'string' ? value : undefined
}

function t(path: string): string {
  return resolve(translations[locale.value], path)
    ?? resolve(translations.en, path)
    ?? path
}

function setLocale(nextLocale: Locale) {
  locale.value = nextLocale
}

function toggleLocale() {
  setLocale(locale.value === 'en' ? 'zh' : 'en')
}

watch(locale, (value) => {
  localStorage.setItem('portfolio-locale', value)
  document.documentElement.lang = value === 'zh' ? 'zh-CN' : 'en'
}, { immediate: true })

export function useI18n() {
  return {
    locale: readonly(locale),
    setLocale,
    toggleLocale,
    t
  }
}
