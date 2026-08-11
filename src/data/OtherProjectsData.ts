import ProjectData from '@/data/ProjectData'

export default [
  new ProjectData(
    'engine-optimization',
    { en: 'Game Engine Optimization · C++', zh: '游戏引擎优化 · C++' },
    '/img/projects/engine-optimization-icon.png',
    {
      en: `
        <div class="paragraph"><strong>Game Engine Optimization</strong> extended a custom C++ engine based on Prime Engine architecture with new systems and performance-focused improvements.</div>
        <div class="paragraph"><strong>Contributions</strong><ul>
          <li>Improved NPC decision logic for more adaptive behavior</li>
          <li>Built a culling strategy that improved frame rate in the test level</li>
          <li>Added a physics component for collision and object interaction</li>
          <li>Extended the animation pipeline with full-body, partial, and additive layer blending</li>
        </ul></div>
        <div class="paragraph center"><p>More demonstrations are available in my <a target="_blank" rel="noopener" href="https://www.youtube.com/playlist?list=PL7QmU5jsTP9ZOtcPFmtNszqU58M-maprN">engine development series</a>.</p><iframe width="560" height="315" src="https://www.youtube.com/embed/Jj7uD8xdJgc" title="Game engine development demo" allowfullscreen></iframe></div>
        <div class="paragraph"><div class="notice">The code is integrated into a private engine fork. Focused code samples are available on request.</div></div>`,
      zh: `
        <div class="paragraph"><strong>游戏引擎优化</strong>项目基于 Prime Engine 架构扩展自定义 C++ 引擎，新增多个系统并进行性能优化。</div>
        <div class="paragraph"><strong>主要贡献</strong><ul>
          <li>改进 NPC 决策逻辑，使行为更具适应性</li>
          <li>设计剔除策略，提高测试关卡的运行帧率</li>
          <li>添加物理组件，实现碰撞与物体交互</li>
          <li>扩展动画管线，支持全身、局部与叠加动画层混合</li>
        </ul></div>
        <div class="paragraph center"><p>更多演示请查看我的<a target="_blank" rel="noopener" href="https://www.youtube.com/playlist?list=PL7QmU5jsTP9ZOtcPFmtNszqU58M-maprN">游戏引擎开发系列</a>。</p><iframe width="560" height="315" src="https://www.youtube.com/embed/Jj7uD8xdJgc" title="游戏引擎开发演示" allowfullscreen></iframe></div>
        <div class="paragraph"><div class="notice">代码已集成到私有引擎分支，可根据需要提供针对性的代码示例。</div></div>`
    },
    '#3979b8',
    true,
    true,
    ['Engine', 'C++', 'Graphics'],
    '2025'
  ),
  new ProjectData(
    'mini-games',
    { en: 'Mini Games Collection', zh: '迷你游戏合集' },
    '/img/projects/java-mini-minesweeper.png',
    {
      en: `
        <div class="paragraph"><strong>Mini Games Collection</strong> is a set of classic games—including Breakout, Minesweeper, and Snake—implemented with minimal external dependencies to strengthen fundamentals in architecture, debugging, and iteration.</div>
        <div class="paragraph"><strong>Focus</strong><ul><li>Reusable game loops and state management</li><li>Grid logic, collision, input, and UI feedback</li><li>Comparable implementations across C++, Java, and lightweight frameworks</li></ul></div>
        <div class="paragraph center"><video class="project-video" controls preload="metadata" src="/img/projects/java-mini-minesweeper.mp4"></video><img class="pc-screenshot" src="/img/projects/cpp-mini-games-icon.png" alt="C++ mini games collection" /></div>
        <div class="paragraph"><div class="notice"><a target="_blank" rel="noopener" href="https://github.com/yuxuanz777/MyCPP_MiniGame">View the C++ repository</a></div></div>`,
      zh: `
        <div class="paragraph"><strong>迷你游戏合集</strong>包含打砖块、扫雷和贪吃蛇等经典游戏。我尽量减少外部依赖，通过重复实现来强化架构、调试和快速迭代的基本功。</div>
        <div class="paragraph"><strong>关注重点</strong><ul><li>可复用的游戏循环与状态管理</li><li>网格逻辑、碰撞、输入与 UI 反馈</li><li>使用 C++、Java 和轻量框架进行对照实现</li></ul></div>
        <div class="paragraph center"><video class="project-video" controls preload="metadata" src="/img/projects/java-mini-minesweeper.mp4"></video><img class="pc-screenshot" src="/img/projects/cpp-mini-games-icon.png" alt="C++ 迷你游戏合集" /></div>
        <div class="paragraph"><div class="notice"><a target="_blank" rel="noopener" href="https://github.com/yuxuanz777/MyCPP_MiniGame">查看 C++ 仓库</a></div></div>`
    },
    '#3c9b76',
    false,
    false,
    ['C++', 'Java', 'Gameplay'],
    '2024 — 2025'
  ),
  new ProjectData(
    'ai-mri-recon',
    { en: 'AI MRI Reconstruction', zh: 'AI 磁共振图像重建' },
    '/img/projects/ai-mri-recon-icon.png',
    {
      en: `
        <div class="paragraph"><strong>AI MRI Reconstruction</strong> is a deep-learning pipeline for accelerated MRI reconstruction, trained on a remote Linux server.</div>
        <div class="paragraph"><strong>Approach</strong><ul><li>Self-supervised learning based on an unrolled diffusion model</li><li>Dual-domain processing across frequency and image space</li><li>Evaluation with PSNR, SSIM, and MAE</li><li>Large-scale TensorFlow training on an NVIDIA RTX 4090 GPU</li></ul></div>
        <div class="paragraph center"><img class="pc-screenshot" src="/img/projects/overall_structure.png" alt="MRI reconstruction model architecture" /><img class="pc-screenshot" src="/img/projects/T1T2.png" alt="MRI reconstruction results" /></div>
        <div class="paragraph"><div class="notice"><a target="_blank" rel="noopener" href="https://arxiv.org/abs/2503.18836">Read the preprint</a> · <a target="_blank" rel="noopener" href="https://yuxuanz777.github.io/DMSM_Page/">Visit the research website</a>. Code access is available on request while the paper is under review.</div></div>`,
      zh: `
        <div class="paragraph"><strong>AI 磁共振图像重建</strong>是用于快速 MRI 重建的深度学习管线，在远程 Linux 服务器上完成训练。</div>
        <div class="paragraph"><strong>研究方法</strong><ul><li>基于展开扩散模型的自监督学习</li><li>在频域与图像域进行双域处理</li><li>使用 PSNR、SSIM 和 MAE 评估结果</li><li>使用 NVIDIA RTX 4090 GPU 进行 TensorFlow 训练</li></ul></div>
        <div class="paragraph center"><img class="pc-screenshot" src="/img/projects/overall_structure.png" alt="MRI 重建模型架构" /><img class="pc-screenshot" src="/img/projects/T1T2.png" alt="MRI 重建结果" /></div>
        <div class="paragraph"><div class="notice"><a target="_blank" rel="noopener" href="https://arxiv.org/abs/2503.18836">阅读预印本</a> · <a target="_blank" rel="noopener" href="https://yuxuanz777.github.io/DMSM_Page/">访问研究网站</a>。论文在审期间，可根据需要提供代码访问。</div></div>`
    },
    '#7b61b5',
    false,
    false,
    ['AI', 'Python', 'Research'],
    '2024 — 2025'
  )
]
