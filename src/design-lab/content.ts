export type LabLocale = 'en' | 'zh'

interface LabProject {
  title: string
  discipline: string
  date: string
  description: string
  image: string
  brandIcon?: string
  tags: string[]
}

interface LabCopy {
  nav: string[]
  role: string
  availability: string
  heroTitle: string
  heroLead: string
  viewWork: string
  contact: string
  selectedWork: string
  workIntro: string
  experience: string
  experienceRole: string
  experienceStudio: string
  experienceDate: string
  experienceBody: string
  experienceVideo: string
  proof: { value: string; label: string }[]
  projects: LabProject[]
  resume: string
  closing: string
}

export const designLabCopy: Record<LabLocale, LabCopy> = {
  en: {
    nav: ['Profile', 'Selected work', 'Experience'],
    role: 'Combat Designer · Game Developer',
    availability: 'Los Angeles · Open to opportunities',
    heroTitle: 'I design combat that players can read, feel, and master.',
    heroLead: 'I’m Seven (Yuxuan) Zhang, a USC computer science graduate student building responsive combat, expressive game systems, and the technology behind them.',
    viewWork: 'View my work',
    contact: 'Contact me',
    selectedWork: 'Selected worlds',
    workIntro: 'Four projects that connect combat design, hands-on implementation, and technical systems thinking.',
    experience: 'Industry experience',
    experienceRole: 'Combat Designer Intern',
    experienceStudio: 'NetEase Leihuo · Justice Online Mobile · MMO',
    experienceDate: 'Feb — Aug 2026',
    experienceBody: 'Designed and configured two combat skills for an upcoming release, coordinated animation, VFX, audio, and technical integration, and tuned 3C, frame data, and hit-stop through internal and core-player testing.',
    experienceVideo: 'Watch combat design project video',
    proof: [
      { value: 'MMO', label: 'Combat design internship' },
      { value: 'UE5 + Unity', label: 'Hands-on engine work' },
      { value: 'Design + Code', label: 'End-to-end ownership' }
    ],
    projects: [
      {
        title: 'Return to Azeroth',
        discipline: 'Personal project · Combat design & engineering',
        date: '2026 —',
        description: 'A Warcraft fan-made action RPG reframed through Souls-like combat, built in Unreal Engine 5 with C++, Blueprint, GAS, boss phases, and enemy AI.',
        image: '/img/projects/return-to-azeroth-cover.jpg',
        brandIcon: '/img/brand/vii-stormwind-v2.png',
        tags: ['Unreal Engine 5', 'C++', 'GAS']
      },
      {
        title: 'Shimmer',
        discipline: '2D platform adventure · Game Jam',
        date: '2025',
        description: 'A bilingual platform adventure where movement between layers of reality becomes both traversal and combat language.',
        image: '/img/projects/shimmer-original-cover.jpg',
        brandIcon: '/img/brand/vii-shimmer-color.png',
        tags: ['Unity', 'C#', 'Systems']
      },
      {
        title: 'Steam Simulator',
        discipline: 'Strategy simulation · Ludum Dare 58',
        date: '2025',
        description: 'A compact strategy, simulation, and roguelike prototype about trading games and shaping a collection inside a volatile procedural market.',
        image: '/img/projects/steam-simulator-icon.png',
        brandIcon: '/img/brand/vii-collector-v3.png',
        tags: ['Unity', 'C#', 'Game Jam']
      },
      {
        title: 'Game Engine Optimization',
        discipline: 'Engine systems · Rendering',
        date: 'Aug — Dec 2025',
        description: 'A focused engine study spanning rendering performance, animation, physics components, and practical profiling workflows.',
        image: '/img/projects/engine-optimization-icon.png',
        tags: ['C++', 'Rendering', 'Optimization']
      }
    ],
    resume: 'View complete resume',
    closing: 'Building systems with clarity. Shaping worlds with intent.'
  },
  zh: {
    nav: ['个人简介', '精选作品', '行业经历'],
    role: '战斗策划 · 游戏开发者',
    availability: '洛杉矶 · 开放工作与合作机会',
    heroTitle: '设计让玩家看得懂、感受得到、值得精通的战斗。',
    heroLead: '我是张宇瑄，南加州大学计算机科学硕士研究生，专注于富有反馈的战斗、具有表现力的玩法系统，以及支撑它们运转的技术。',
    viewWork: '查看作品',
    contact: '联系我',
    selectedWork: '精选世界',
    workIntro: '四个代表项目，连接战斗设计、亲手实现与技术系统思维。',
    experience: '行业经历',
    experienceRole: '战斗策划实习生',
    experienceStudio: '网易雷火 · 《逆水寒》手游 · MMO',
    experienceDate: '2026 年 2 月 — 8 月',
    experienceBody: '为后续版本设计并配置两项战斗技能，端到端协调动画、特效、音频与技术接入，并通过内部和核心玩家测试打磨 3C、帧数据与打击停顿。',
    experienceVideo: '观看战斗设计项目视频',
    proof: [
      { value: 'MMO', label: '战斗策划实习经历' },
      { value: 'UE5 + Unity', label: '双引擎开发实践' },
      { value: '设计 + 代码', label: '端到端实现能力' }
    ],
    projects: [
      {
        title: '重返艾泽拉斯',
        discipline: '个人项目 · 战斗设计与工程实现',
        date: '2026 —',
        description: '使用 Unreal Engine 5、C++、Blueprint 与 GAS，将魔兽同人世界重构为强调读招、格挡与节奏的类魂动作 RPG。',
        image: '/img/projects/return-to-azeroth-cover.jpg',
        brandIcon: '/img/brand/vii-stormwind-v2.png',
        tags: ['Unreal Engine 5', 'C++', 'GAS']
      },
      {
        title: 'Shimmer',
        discipline: '2D 平台冒险 · Game Jam',
        date: '2025',
        description: '一款支持中英文的 2D 平台冒险游戏，让现实层级之间的切换同时成为移动方式与战斗语言。',
        image: '/img/projects/shimmer-original-cover.jpg',
        brandIcon: '/img/brand/vii-shimmer-color.png',
        tags: ['Unity', 'C#', '系统设计']
      },
      {
        title: 'Steam 模拟器',
        discipline: '策略模拟 · Ludum Dare 58',
        date: '2025',
        description: '一款紧凑的策略、模拟与 Roguelike 原型，围绕买卖游戏、经营收藏，以及应对程序化市场波动展开。',
        image: '/img/projects/steam-simulator-icon.png',
        brandIcon: '/img/brand/vii-collector-v3.png',
        tags: ['Unity', 'C#', 'Game Jam']
      },
      {
        title: '游戏引擎优化',
        discipline: '引擎系统 · 渲染',
        date: '2025 年 8 月 — 12 月',
        description: '围绕渲染性能、动画、物理组件与性能分析流程展开的引擎实践。',
        image: '/img/projects/engine-optimization-icon.png',
        tags: ['C++', '渲染', '性能优化']
      }
    ],
    resume: '查看完整简历',
    closing: '以清晰构筑系统，以意图塑造世界。'
  }
}
