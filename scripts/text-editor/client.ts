import accessToken from 'virtual:local-text-editor-token'

interface Candidate {
  id: string
  file: string
  offset: number
  length: number
  line: number
  column: number
  preview: string
  quote: "'" | '"' | '`' | null
}

interface PendingEdit {
  candidate: Candidate
  original: string
  wrapper: HTMLSpanElement
}

interface RepositoryStatus {
  branch: string
  origin: string
  statusLines: string[]
  stagedFiles: string[]
  sessionFiles: string[]
  savedAt: string
  unrelatedStaged: string[]
  pagesRepository: string
  pagesExists: boolean
  pagesIsGitRepository: boolean
  pagesBranch: string
  pagesOrigin: string
  pagesStatusLines: string[]
  token: string
}

const API_PREFIX = '/__text-editor'
const pendingEdits = new Map<string, PendingEdit>()
let editMode = true
let busy = false

const style = document.createElement('style')
style.textContent = `
  :root { --te-gold: #dfbf78; --te-ink: #0b100e; --te-teal: #66b7ae; }
  #text-editor-toolbar, .text-editor-modal, .text-editor-toast { font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
  #text-editor-toolbar {
    position: fixed; right: 18px; bottom: 18px; z-index: 2147483600; width: min(390px, calc(100vw - 36px));
    color: #e8e4db; border: 1px solid rgba(223,191,120,.4); border-radius: 15px;
    background: rgba(9,14,12,.95); box-shadow: 0 24px 80px rgba(0,0,0,.5); backdrop-filter: blur(18px); overflow: hidden;
  }
  .te-head { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:13px 15px; border-bottom:1px solid rgba(223,191,120,.18); }
  .te-brand { display:flex; align-items:center; gap:10px; min-width:0; }
  .te-rune { display:grid; place-items:center; width:29px; height:29px; flex:0 0 auto; border:1px solid rgba(102,183,174,.5); color:var(--te-teal); }
  .te-title { font-weight:700; font-size:13px; letter-spacing:.04em; }
  .te-subtitle { margin-top:2px; color:#989d97; font-size:10px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .te-body { padding:13px 15px 15px; }
  .te-hint { margin:0 0 12px; color:#b8bbb5; font-size:12px; line-height:1.55; }
  .te-actions { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .te-button { min-height:38px; padding:0 12px; border:1px solid rgba(223,191,120,.28); border-radius:8px; color:#dedbd3; background:#151b18; font:inherit; font-size:12px; cursor:pointer; }
  .te-button:hover:not(:disabled) { border-color:var(--te-gold); color:#fff3d3; }
  .te-button.primary { color:#111510; border-color:var(--te-gold); background:linear-gradient(135deg,#e4c985,#af8545); font-weight:700; }
  .te-button.te-active { border-color:var(--te-teal); color:#c9fff9; background:rgba(62,126,119,.18); }
  .te-button:disabled { opacity:.38; cursor:not-allowed; }
  .te-count { display:inline-grid; place-items:center; min-width:18px; height:18px; margin-left:5px; padding:0 5px; border-radius:99px; color:#08100d; background:var(--te-teal); font-size:10px; font-weight:800; }
  .text-editor-hover { outline:2px dashed rgba(102,183,174,.9) !important; outline-offset:4px !important; cursor:text !important; }
  [data-text-editor-editing] { min-width:.35em; border-radius:3px; outline:2px solid var(--te-gold) !important; outline-offset:3px !important; background:rgba(223,191,120,.16) !important; cursor:text !important; }
  [data-text-editor-dirty] { box-shadow:inset 0 -2px 0 #f0bd57; }
  .text-editor-toast { position:fixed; left:50%; top:22px; z-index:2147483646; max-width:min(560px,calc(100vw - 32px)); padding:11px 15px; transform:translateX(-50%); border:1px solid rgba(102,183,174,.45); border-radius:9px; color:#e8eee9; background:rgba(7,13,11,.96); box-shadow:0 16px 50px rgba(0,0,0,.45); font-size:12px; line-height:1.5; }
  .text-editor-toast.error { border-color:#c96d62; color:#ffd8d2; }
  .text-editor-modal { position:fixed; inset:0; z-index:2147483645; display:grid; place-items:center; padding:20px; color:#e8e4db; background:rgba(2,5,4,.78); backdrop-filter:blur(7px); }
  .te-dialog { width:min(650px,100%); max-height:min(760px,calc(100vh - 40px)); display:flex; flex-direction:column; border:1px solid rgba(223,191,120,.4); border-radius:14px; background:#0d1310; box-shadow:0 30px 100px rgba(0,0,0,.65); overflow:hidden; }
  .te-dialog header { padding:18px 20px 14px; border-bottom:1px solid rgba(223,191,120,.16); }
  .te-dialog h2 { margin:0; color:#f1e8d2; font:700 17px/1.3 Inter,ui-sans-serif,system-ui,sans-serif; }
  .te-dialog header p { margin:7px 0 0; color:#9da29d; font-size:12px; line-height:1.5; }
  .te-dialog-content { padding:16px 20px; overflow:auto; }
  .te-dialog footer { display:flex; justify-content:flex-end; gap:9px; padding:14px 20px; border-top:1px solid rgba(223,191,120,.16); }
  .te-candidates { display:grid; gap:8px; }
  .te-candidate { width:100%; padding:11px 12px; text-align:left; border:1px solid rgba(223,191,120,.2); border-radius:8px; color:#dcd9d1; background:#121916; cursor:pointer; }
  .te-candidate:hover { border-color:var(--te-teal); }
  .te-file { color:#88d4ca; font:600 11px/1.4 ui-monospace,SFMono-Regular,Consolas,monospace; }
  .te-preview { margin-top:5px; color:#aaaFA9; font:11px/1.45 ui-monospace,SFMono-Regular,Consolas,monospace; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .te-summary { margin:0; padding-left:19px; color:#c8cbc5; font-size:12px; line-height:1.8; }
  .te-code-list { margin:10px 0 0; padding:10px 12px; border:1px solid rgba(255,255,255,.08); border-radius:8px; color:#bfc5bf; background:#080c0a; font:11px/1.6 ui-monospace,SFMono-Regular,Consolas,monospace; white-space:pre-wrap; overflow-wrap:anywhere; }
  .te-warning { margin:12px 0 0; padding:10px 12px; border:1px solid rgba(207,108,94,.5); border-radius:8px; color:#ffd0c9; background:rgba(130,47,39,.12); font-size:12px; line-height:1.55; }
  .te-field { display:grid; gap:6px; margin-top:14px; color:#bfc3bd; font-size:12px; }
  .te-field input[type=text] { width:100%; height:39px; padding:0 11px; border:1px solid rgba(223,191,120,.25); border-radius:7px; color:#f0eee7; background:#080d0b; font:12px ui-monospace,SFMono-Regular,Consolas,monospace; }
  .te-check { display:flex; align-items:flex-start; gap:9px; margin-top:15px; color:#d0d2cc; font-size:12px; line-height:1.5; }
  .te-check input { margin-top:3px; accent-color:#c7a45e; }
  @media (max-width:600px) { #text-editor-toolbar { right:10px; bottom:10px; width:calc(100vw - 20px); } .te-dialog-content { padding:14px; } }
`
document.head.append(style)

const toolbar = document.createElement('aside')
toolbar.id = 'text-editor-toolbar'
toolbar.dataset.textEditorUi = 'true'
toolbar.innerHTML = `
  <div class="te-head">
    <div class="te-brand"><span class="te-rune">✎</span><div><div class="te-title">本地文本编辑器</div><div class="te-subtitle">只在 npm run edit 中启用</div></div></div>
    <button class="te-button te-active" data-action="toggle" type="button">编辑中</button>
  </div>
  <div class="te-body">
    <p class="te-hint">点击普通文字开始编辑。链接、按钮和项目卡片可直接操作；按住 Alt（macOS 为 Option）点击可编辑其中的文字。按 Esc 可暂停编辑。</p>
    <div class="te-actions">
      <button class="te-button primary" data-action="save" type="button" disabled>保存到本地 <span class="te-count">0</span></button>
      <button class="te-button" data-action="publish" type="button">提交并发布</button>
    </div>
  </div>
`
document.body.append(toolbar)

const toggleButton = toolbar.querySelector<HTMLButtonElement>('[data-action=toggle]')!
const saveButton = toolbar.querySelector<HTMLButtonElement>('[data-action=save]')!
const publishButton = toolbar.querySelector<HTMLButtonElement>('[data-action=publish]')!
const countBadge = toolbar.querySelector<HTMLElement>('.te-count')!

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_PREFIX}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-editor-token': accessToken,
      ...options.headers
    }
  })
  const value = await response.json() as T & { error?: string }
  if (!response.ok) throw new Error(value.error || `请求失败（${response.status}）`)
  return value
}

function toast(message: string, type: 'normal' | 'error' = 'normal', duration = 3200) {
  const element = document.createElement('div')
  element.className = `text-editor-toast${type === 'error' ? ' error' : ''}`
  element.dataset.textEditorUi = 'true'
  element.textContent = message
  document.body.append(element)
  window.setTimeout(() => element.remove(), duration)
}

function setBusy(next: boolean) {
  busy = next
  toggleButton.disabled = next
  saveButton.disabled = next || pendingEdits.size === 0
  publishButton.disabled = next
}

function updateToolbar() {
  countBadge.textContent = String(pendingEdits.size)
  saveButton.disabled = busy || pendingEdits.size === 0
  toggleButton.classList.toggle('te-active', editMode)
  toggleButton.textContent = editMode ? '编辑中' : '已暂停'
}

function setEditMode(next: boolean) {
  editMode = next
  document.querySelector('.text-editor-hover')?.classList.remove('text-editor-hover')
  updateToolbar()
}

function showModal(title: string, description: string, content: HTMLElement) {
  const modal = document.createElement('div')
  modal.className = 'text-editor-modal'
  modal.dataset.textEditorUi = 'true'
  modal.innerHTML = `<section class="te-dialog" role="dialog" aria-modal="true"><header><h2></h2><p></p></header><div class="te-dialog-content"></div><footer></footer></section>`
  modal.querySelector('h2')!.textContent = title
  modal.querySelector('header p')!.textContent = description
  modal.querySelector('.te-dialog-content')!.append(content)
  document.body.append(modal)
  return {
    modal,
    footer: modal.querySelector('footer') as HTMLElement,
    close: () => modal.remove()
  }
}

function modalButton(label: string, primary = false) {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = `te-button${primary ? ' primary' : ''}`
  button.textContent = label
  return button
}

function isEditorUi(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest('[data-text-editor-ui]'))
}

const INTERACTIVE_SELECTOR = 'a[href], button, input, select, textarea, summary, [role="button"], [role="link"]'

function interactiveAncestor(target: EventTarget | null) {
  return target instanceof Element ? target.closest(INTERACTIVE_SELECTOR) : null
}

function fallbackTextNode(element: Element): Text | null {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    }
  })
  return walker.nextNode() as Text | null
}

function textNodeAtPoint(event: MouseEvent): Text | null {
  const documentWithCaret = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node }
    caretRangeFromPoint?: (x: number, y: number) => Range | null
  }
  const position = documentWithCaret.caretPositionFromPoint?.(event.clientX, event.clientY)
  if (position?.offsetNode.nodeType === Node.TEXT_NODE && position.offsetNode.textContent?.trim()) {
    return position.offsetNode as Text
  }
  const range = documentWithCaret.caretRangeFromPoint?.(event.clientX, event.clientY)
  if (range?.startContainer.nodeType === Node.TEXT_NODE && range.startContainer.textContent?.trim()) {
    return range.startContainer as Text
  }
  return event.target instanceof Element ? fallbackTextNode(event.target) : null
}

function chooseCandidate(candidates: Candidate[]): Promise<Candidate | null> {
  if (candidates.length === 1) return Promise.resolve(candidates[0])
  return new Promise(resolveChoice => {
    const list = document.createElement('div')
    list.className = 'te-candidates'
    const dialog = showModal('选择对应的源文字', '页面上有相同文字，请根据文件和上下文选择要修改的那一处。', list)
    for (const candidate of candidates) {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'te-candidate'
      button.innerHTML = `<div class="te-file"></div><div class="te-preview"></div>`
      button.querySelector('.te-file')!.textContent = `${candidate.file}:${candidate.line}:${candidate.column}`
      button.querySelector('.te-preview')!.textContent = candidate.preview
      button.addEventListener('click', () => {
        dialog.close()
        resolveChoice(candidate)
      })
      list.append(button)
    }
    const cancel = modalButton('取消')
    cancel.addEventListener('click', () => {
      dialog.close()
      resolveChoice(null)
    })
    dialog.footer.append(cancel)
  })
}

function wrapTextNode(node: Text, candidate: Candidate) {
  const key = `${candidate.file}:${candidate.offset}`
  const existing = pendingEdits.get(key)
  if (existing?.wrapper.isConnected) {
    existing.wrapper.focus()
    toast('这处源文字已经在页面上打开，请继续编辑高亮位置。')
    return
  }
  const fullText = node.data
  const leading = fullText.match(/^\s*/u)?.[0].length ?? 0
  const trailing = fullText.match(/\s*$/u)?.[0].length ?? 0
  const coreLength = fullText.length - leading - trailing
  if (coreLength <= 0) return
  let core = node
  if (leading > 0) core = node.splitText(leading)
  if (trailing > 0) core.splitText(coreLength)

  const original = core.data
  const wrapper = document.createElement('span')
  wrapper.dataset.textEditorEditing = key
  wrapper.contentEditable = 'plaintext-only'
  wrapper.spellcheck = false
  wrapper.textContent = original
  core.replaceWith(wrapper)
  pendingEdits.set(key, { candidate, original, wrapper })

  wrapper.addEventListener('input', () => {
    wrapper.toggleAttribute('data-text-editor-dirty', (wrapper.textContent ?? '') !== original)
  })
  wrapper.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault()
      wrapper.blur()
      setEditMode(false)
    }
  })
  wrapper.focus()
  const selection = window.getSelection()
  const range = document.createRange()
  range.selectNodeContents(wrapper)
  selection?.removeAllRanges()
  selection?.addRange(range)
  updateToolbar()
}

async function beginEditing(event: MouseEvent) {
  const node = textNodeAtPoint(event)
  if (!node || node.parentElement?.closest('[data-text-editor-editing]')) return
  const text = node.data.trim()
  if (!text) return
  setBusy(true)
  try {
    const locale = document.documentElement.lang.toLowerCase().startsWith('zh') ? 'zh' : 'en'
    const result = await api<{ candidates: Candidate[] }>('/locate', {
      method: 'POST', body: JSON.stringify({ text, locale })
    })
    if (result.candidates.length === 0) {
      toast('没有在可编辑源码中找到这段文字。动态数字、图标和第三方内容暂不支持。', 'error', 5000)
      return
    }
    const candidate = await chooseCandidate(result.candidates)
    if (candidate) wrapTextNode(node, candidate)
  } catch (error) {
    toast(error instanceof Error ? error.message : String(error), 'error', 6000)
  } finally {
    setBusy(false)
    updateToolbar()
  }
}

document.addEventListener('mouseover', event => {
  if (!editMode || busy || isEditorUi(event.target) || !(event.target instanceof Element)) return
  document.querySelector('.text-editor-hover')?.classList.remove('text-editor-hover')
  if (interactiveAncestor(event.target) && !event.altKey) return
  if (fallbackTextNode(event.target)) event.target.classList.add('text-editor-hover')
}, true)

document.addEventListener('mouseout', event => {
  if (event.target instanceof Element) event.target.classList.remove('text-editor-hover')
}, true)

document.addEventListener('click', event => {
  if (!editMode || busy || isEditorUi(event.target)) return
  const target = event.target instanceof Element ? event.target : null
  if (target?.closest('[data-text-editor-editing]')) {
    event.preventDefault()
    return
  }
  if (interactiveAncestor(event.target) && !event.altKey) return
  event.preventDefault()
  event.stopImmediatePropagation()
  void beginEditing(event)
}, true)

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !isEditorUi(event.target)) setEditMode(false)
})

toggleButton.addEventListener('click', () => setEditMode(!editMode))

saveButton.addEventListener('click', () => {
  const edits = [...pendingEdits.values()]
    .map(edit => ({
      candidate: {
        file: edit.candidate.file,
        offset: edit.candidate.offset,
        length: edit.candidate.length,
        quote: edit.candidate.quote
      },
      original: edit.original,
      updated: edit.wrapper.textContent ?? ''
    }))
    .filter(edit => edit.original !== edit.updated)

  if (edits.length === 0) {
    toast('文字没有发生变化。')
    return
  }
  const content = document.createElement('div')
  content.innerHTML = `<ul class="te-summary"></ul>`
  const list = content.querySelector('ul')!
  for (const edit of edits) {
    const item = document.createElement('li')
    item.textContent = `${edit.candidate.file}：${edit.original} → ${edit.updated}`
    list.append(item)
  }
  const dialog = showModal('确认保存到本地', `将把 ${edits.length} 处文字回写到项目源文件。此步骤不会执行 Git 提交。`, content)
  const cancel = modalButton('继续编辑')
  const confirm = modalButton('确认保存', true)
  cancel.addEventListener('click', dialog.close)
  confirm.addEventListener('click', async () => {
    confirm.disabled = true
    confirm.textContent = '正在保存…'
    try {
      const result = await api<{ message: string }>('/save', { method: 'POST', body: JSON.stringify({ edits }) })
      pendingEdits.clear()
      dialog.close()
      updateToolbar()
      toast(`${result.message} 页面会通过热更新显示最新内容。`, 'normal', 5000)
    } catch (error) {
      confirm.disabled = false
      confirm.textContent = '确认保存'
      toast(error instanceof Error ? error.message : String(error), 'error', 7000)
    }
  })
  dialog.footer.append(cancel, confirm)
})

publishButton.addEventListener('click', async () => {
  setBusy(true)
  try {
    const status = await api<RepositoryStatus>('/status')
    const content = document.createElement('div')
    const files = status.sessionFiles.length ? status.sessionFiles.join('\n') : '（无）'
    content.innerHTML = `
      <ul class="te-summary">
        <li>源码分支：<strong></strong></li>
        <li>源码远端：<span></span></li>
        <li>网页仓库：<span></span></li>
        <li>网页远端：<span></span></li>
      </ul>
      <div class="te-code-list"></div>
      <label class="te-field">提交说明<input type="text" maxlength="120"></label>
      <label class="te-check"><input type="checkbox"><span>我已核对以上文件，并确认运行检查、提交源码、推送当前分支，然后更新并推送个人网页仓库。</span></label>
    `
    const summaryItems = content.querySelectorAll('.te-summary li')
    summaryItems[0].querySelector('strong')!.textContent = status.branch || '（detached HEAD）'
    summaryItems[1].querySelector('span')!.textContent = status.origin
    summaryItems[2].querySelector('span')!.textContent = `${status.pagesRepository} (${status.pagesBranch || '未知分支'})`
    summaryItems[3].querySelector('span')!.textContent = status.pagesOrigin || '（无法读取）'
    content.querySelector('.te-code-list')!.textContent = `本次文本文件：\n${files}`
    const messageInput = content.querySelector<HTMLInputElement>('input[type=text]')!
    messageInput.value = `Update website copy (${new Date().toISOString().slice(0, 10)})`
    const checkbox = content.querySelector<HTMLInputElement>('input[type=checkbox]')!
    const blockers: string[] = []
    if (status.sessionFiles.length === 0) blockers.push('没有已保存的文本编辑会话，请先修改并保存文字。')
    if (!status.branch) blockers.push('当前不在命名分支上。')
    if (!status.pagesExists) blockers.push(`找不到网页仓库：${status.pagesRepository}`)
    if (status.pagesExists && !status.pagesIsGitRepository) blockers.push('网页发布目录不是有效的 Git 仓库。')
    if (status.pagesIsGitRepository && status.pagesBranch !== 'main') blockers.push(`网页仓库必须位于 main 分支，当前为 ${status.pagesBranch || 'detached HEAD'}。`)
    if (status.pagesStatusLines.length > 0) blockers.push(`网页仓库含有未提交内容：${status.pagesStatusLines.join(', ')}`)
    if (status.unrelatedStaged.length > 0) blockers.push(`暂存区包含本次文本编辑以外的文件：${status.unrelatedStaged.join(', ')}`)
    if (blockers.length > 0) {
      const warning = document.createElement('div')
      warning.className = 'te-warning'
      warning.textContent = blockers.join(' ')
      content.append(warning)
    }

    const dialog = showModal('确认提交并发布', '这是第二次确认。完整检查通过后才会提交和推送；网页仓库会同步最新的 dist 构建。', content)
    const cancel = modalButton('取消')
    const confirm = modalButton('运行检查并发布', true)
    confirm.disabled = true
    cancel.addEventListener('click', dialog.close)
    checkbox.addEventListener('change', () => { confirm.disabled = !checkbox.checked || blockers.length > 0 })
    confirm.addEventListener('click', async () => {
      confirm.disabled = true
      cancel.disabled = true
      confirm.textContent = '检查、提交与发布中…'
      try {
        const result = await api<{ message: string; logs: string[] }>('/publish', {
          method: 'POST',
          body: JSON.stringify({ token: status.token, commitMessage: messageInput.value })
        })
        dialog.close()
        toast(result.message, 'normal', 7000)
      } catch (error) {
        cancel.disabled = false
        confirm.disabled = false
        confirm.textContent = '重新尝试发布'
        toast(error instanceof Error ? error.message : String(error), 'error', 10000)
      }
    })
    dialog.footer.append(cancel, confirm)
  } catch (error) {
    toast(error instanceof Error ? error.message : String(error), 'error', 7000)
  } finally {
    setBusy(false)
  }
})

updateToolbar()
toast('文本编辑器已启动：点击页面文字即可编辑。', 'normal', 4200)
