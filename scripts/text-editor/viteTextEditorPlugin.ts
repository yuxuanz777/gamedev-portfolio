import { createHash, randomBytes } from 'node:crypto'
import { execFile } from 'node:child_process'
import { cp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { extname, join, relative, resolve, sep } from 'node:path'
import { promisify } from 'node:util'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'

const execFileAsync = promisify(execFile)
const API_PREFIX = '/__text-editor'
const MAX_BODY_BYTES = 1_000_000
const SOURCE_EXTENSIONS = new Set(['.ts', '.vue'])
const VIRTUAL_TOKEN_ID = 'virtual:local-text-editor-token'
const RESOLVED_VIRTUAL_TOKEN_ID = `\0${VIRTUAL_TOKEN_ID}`

interface TextEditorPluginOptions {
  pagesRepository?: string
}

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

interface TextEdit {
  candidate: Pick<Candidate, 'file' | 'offset' | 'length' | 'quote'>
  original: string
  updated: string
}

interface SessionData {
  files: string[]
  savedAt: string
}

interface CommandResult {
  stdout: string
  stderr: string
}

function json(response: ServerResponse, status: number, value: unknown) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.end(JSON.stringify(value))
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return String(error)
}

async function readJsonBody(request: IncomingMessage) {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > MAX_BODY_BYTES) throw new Error('请求内容过大。')
    chunks.push(buffer)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}') as Record<string, unknown>
}

async function walkSourceFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map(async entry => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return walkSourceFiles(path)
    return SOURCE_EXTENSIONS.has(extname(entry.name)) ? [path] : []
  }))
  return files.flat()
}

function lineDetails(source: string, offset: number) {
  const before = source.slice(0, offset)
  const line = before.split('\n').length
  const lastNewline = before.lastIndexOf('\n')
  const column = offset - lastNewline
  const lineStart = lastNewline + 1
  const lineEnd = source.indexOf('\n', offset)
  const currentLine = source.slice(lineStart, lineEnd === -1 ? source.length : lineEnd).trim()
  return {
    line,
    column,
    preview: currentLine.length > 150 ? `${currentLine.slice(0, 147)}…` : currentLine
  }
}

function detectQuote(source: string, offset: number): Candidate['quote'] {
  let quote: Candidate['quote'] = null
  let escaped = false
  for (let index = 0; index < offset; index += 1) {
    const character = source[index]
    if (escaped) {
      escaped = false
      continue
    }
    if (character === '\\') {
      escaped = true
      continue
    }
    if (quote) {
      if (character === quote) quote = null
      continue
    }
    if (character === "'" || character === '"' || character === '`') quote = character
  }
  return quote
}

function localeRank(source: string, offset: number, locale: string) {
  const enMarker = source.indexOf('\n  en: {')
  const zhMarker = source.indexOf('\n  zh: {')
  if (enMarker === -1 || zhMarker === -1) return 1
  const isEnglishBlock = offset > enMarker && offset < zhMarker
  return (locale === 'en') === isEnglishBlock ? 0 : 2
}

async function locateCandidates(root: string, text: string, locale: string): Promise<Candidate[]> {
  if (!text.trim()) return []
  const sourceRoot = join(root, 'src')
  const files = await walkSourceFiles(sourceRoot)
  const candidates: Array<Candidate & { rank: number }> = []

  for (const absoluteFile of files) {
    const source = await readFile(absoluteFile, 'utf8')
    let offset = source.indexOf(text)
    while (offset !== -1) {
      const file = relative(root, absoluteFile).split(sep).join('/')
      const details = lineDetails(source, offset)
      const quote = extname(absoluteFile) === '.ts' ? detectQuote(source, offset) : null
      const rank = file === 'src/i18n.ts' ? localeRank(source, offset, locale) : 1
      candidates.push({
        id: createHash('sha1').update(`${file}:${offset}:${text}`).digest('hex').slice(0, 12),
        file,
        offset,
        length: text.length,
        quote,
        rank,
        ...details
      })
      offset = source.indexOf(text, offset + text.length)
    }
  }

  return candidates
    .sort((left, right) => left.rank - right.rank || left.file.localeCompare(right.file) || left.offset - right.offset)
    .map(candidate => {
      const result: Candidate & { rank?: number } = { ...candidate }
      delete result.rank
      return result
    })
}

function assertRelativeSourceFile(root: string, file: string) {
  const normalized = file.replaceAll('\\', '/')
  if (!normalized.startsWith('src/') || !SOURCE_EXTENSIONS.has(extname(normalized))) {
    throw new Error(`不允许修改文件：${file}`)
  }
  const absolute = resolve(root, normalized)
  const sourceRoot = `${resolve(root, 'src')}${sep}`
  if (!absolute.startsWith(sourceRoot)) throw new Error(`文件路径超出源码目录：${file}`)
  return absolute
}

function encodeForSource(value: string, quote: Candidate['quote']) {
  const normalized = value.replace(/\r\n?/g, '\n')
  if (!quote) return normalized
  let encoded = normalized.replaceAll('\\', '\\\\')
  if (quote === "'") encoded = encoded.replaceAll("'", "\\'")
  if (quote === '"') encoded = encoded.replaceAll('"', '\\"')
  if (quote === '`') encoded = encoded.replaceAll('`', '\\`').replaceAll('${', '\\${')
  return encoded.replaceAll('\n', '\\n')
}

async function sessionPath(root: string) {
  const { stdout } = await runGit(root, ['rev-parse', '--git-dir'])
  return resolve(root, stdout.trim(), 'text-editor-session.json')
}

async function readSession(root: string): Promise<SessionData> {
  try {
    return JSON.parse(await readFile(await sessionPath(root), 'utf8')) as SessionData
  } catch {
    return { files: [], savedAt: '' }
  }
}

async function writeSession(root: string, session: SessionData) {
  const path = await sessionPath(root)
  await writeFile(path, `${JSON.stringify(session, null, 2)}\n`, 'utf8')
}

async function saveEdits(root: string, edits: TextEdit[]) {
  if (!Array.isArray(edits) || edits.length === 0) throw new Error('没有待保存的文字修改。')
  const grouped = new Map<string, TextEdit[]>()
  for (const edit of edits) {
    if (!edit || typeof edit.original !== 'string' || typeof edit.updated !== 'string') {
      throw new Error('修改数据格式无效。')
    }
    if (edit.original === edit.updated) continue
    if (edit.updated.length > 20_000) throw new Error('单段文字不能超过 20,000 个字符。')
    const absolute = assertRelativeSourceFile(root, edit.candidate.file)
    const list = grouped.get(absolute) ?? []
    list.push(edit)
    grouped.set(absolute, list)
  }
  if (grouped.size === 0) throw new Error('文字没有发生变化。')

  const changedFiles: string[] = []
  for (const [absolute, fileEdits] of grouped) {
    let source = await readFile(absolute, 'utf8')
    const sorted = [...fileEdits].sort((left, right) => right.candidate.offset - left.candidate.offset)
    for (const edit of sorted) {
      const { offset, length, quote } = edit.candidate
      if (!Number.isInteger(offset) || !Number.isInteger(length) || offset < 0 || length < 1) {
        throw new Error(`“${edit.original}”的源码位置无效，请刷新页面后重试。`)
      }
      const current = source.slice(offset, offset + length)
      if (current !== edit.original) {
        throw new Error(`${edit.candidate.file} 已在编辑期间变化，请刷新页面后重新选择文字。`)
      }
      source = `${source.slice(0, offset)}${encodeForSource(edit.updated, quote)}${source.slice(offset + length)}`
    }
    await writeFile(absolute, source, 'utf8')
    changedFiles.push(relative(root, absolute).split(sep).join('/'))
  }

  const previous = await readSession(root)
  const files = [...new Set([...previous.files, ...changedFiles])].sort()
  const session = { files, savedAt: new Date().toISOString() }
  await writeSession(root, session)
  return session
}

async function run(command: string, args: string[], cwd: string, env?: NodeJS.ProcessEnv): Promise<CommandResult> {
  try {
    const result = await execFileAsync(command, args, {
      cwd,
      env: { ...process.env, ...env },
      maxBuffer: 10 * 1024 * 1024,
      windowsHide: true
    })
    return { stdout: result.stdout, stderr: result.stderr }
  } catch (error) {
    const details = error as Error & { stdout?: string; stderr?: string }
    const output = [details.message, details.stdout, details.stderr].filter(Boolean).join('\n').trim()
    throw new Error(output)
  }
}

function runGit(cwd: string, args: string[]) {
  // The editor can be launched by an isolated local process whose OS account
  // differs from the account that owns the checked-out repositories. Trust
  // only the repository used by this individual Git invocation instead of
  // changing the user's global safe.directory configuration.
  const safeDirectory = resolve(cwd).split(sep).join('/')
  return run('git', ['-c', `safe.directory=${safeDirectory}`, ...args], cwd)
}

async function runProjectCheck(root: string) {
  try {
    return await run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'check'], root)
  } catch (error) {
    // Node 24 on Windows can report EINVAL instead of ENOENT when a .cmd
    // executable cannot be resolved. Both mean npm could not be started here.
    if (!/\b(?:ENOENT|EINVAL)\b/.test(errorMessage(error))) throw error

    const commands: Array<[string, string[]]> = [
      ['node_modules/vue-tsc/bin/vue-tsc.js', ['--noEmit']],
      ['node_modules/eslint/bin/eslint.js', ['.', '--max-warnings=0']],
      ['scripts/check-assets.mjs', []],
      ['node_modules/vite/bin/vite.js', ['build']]
    ]
    const output: string[] = ['npm is unavailable; running the equivalent local checks with Node.']
    for (const [script, args] of commands) {
      const result = await run(process.execPath, [resolve(root, script), ...args], root)
      output.push(result.stdout.trim(), result.stderr.trim())
    }
    return { stdout: output.filter(Boolean).join('\n'), stderr: '' }
  }
}

async function commitWithRepositoryIdentity(cwd: string, message: string) {
  const [nameResult, emailResult] = await Promise.all([
    runGit(cwd, ['log', '-1', '--format=%an']),
    runGit(cwd, ['log', '-1', '--format=%ae'])
  ])
  const name = nameResult.stdout.trim()
  const email = emailResult.stdout.trim()
  if (!name || !email) {
    throw new Error(`无法从 ${cwd} 的上一条提交读取 Git 作者身份。`)
  }
  return runGit(cwd, [
    '-c', `user.name=${name}`,
    '-c', `user.email=${email}`,
    'commit', '-m', message
  ])
}

async function gitLines(root: string, args: string[]) {
  const { stdout } = await runGit(root, args)
  return stdout.split(/\r?\n/).map(line => line.trim()).filter(Boolean)
}

async function repositoryStatus(root: string, pagesRepository: string) {
  const session = await readSession(root)
  const [branchResult, remoteResult, statusLines, stagedFiles] = await Promise.all([
    runGit(root, ['branch', '--show-current']),
    runGit(root, ['remote', 'get-url', 'origin']),
    gitLines(root, ['status', '--short']),
    gitLines(root, ['diff', '--cached', '--name-only'])
  ])
  const sessionSet = new Set(session.files)
  const unrelatedStaged = stagedFiles.filter(file => !sessionSet.has(file.replaceAll('\\', '/')))
  const pagesExists = await stat(pagesRepository).then(item => item.isDirectory()).catch(() => false)
  let pagesBranch = ''
  let pagesOrigin = ''
  let pagesStatusLines: string[] = []
  let pagesIsGitRepository = false
  if (pagesExists && resolve(pagesRepository) !== resolve(root)) {
    try {
      const [branch, origin, status] = await Promise.all([
        runGit(pagesRepository, ['branch', '--show-current']),
        runGit(pagesRepository, ['remote', 'get-url', 'origin']),
        gitLines(pagesRepository, ['status', '--short'])
      ])
      pagesBranch = branch.stdout.trim()
      pagesOrigin = origin.stdout.trim()
      pagesStatusLines = status
      pagesIsGitRepository = true
    } catch {
      pagesIsGitRepository = false
    }
  }
  const data = {
    branch: branchResult.stdout.trim(),
    origin: remoteResult.stdout.trim(),
    statusLines,
    stagedFiles,
    sessionFiles: session.files,
    savedAt: session.savedAt,
    unrelatedStaged,
    pagesRepository,
    pagesExists,
    pagesIsGitRepository,
    pagesBranch,
    pagesOrigin,
    pagesStatusLines
  }
  return {
    ...data,
    token: createHash('sha256').update(JSON.stringify(data)).digest('hex')
  }
}

async function clearDirectoryExceptGit(directory: string) {
  const resolvedDirectory = resolve(directory)
  const entries = await readdir(resolvedDirectory, { withFileTypes: true })
  await Promise.all(entries
    .filter(entry => entry.name !== '.git')
    .map(entry => rm(join(resolvedDirectory, entry.name), { recursive: true, force: true })))
}

async function publish(root: string, pagesRepository: string, token: string, commitMessage: string) {
  const before = await repositoryStatus(root, pagesRepository)
  if (token !== before.token) throw new Error('仓库状态已经变化，请重新检查发布内容并再次确认。')
  if (!before.branch) throw new Error('当前处于 detached HEAD，无法安全发布。')
  if (before.sessionFiles.length === 0) throw new Error('当前没有由文本编辑器保存的文件。')
  if (before.unrelatedStaged.length > 0) {
    throw new Error(`Git 暂存区含有本次文本编辑以外的文件：${before.unrelatedStaged.join(', ')}。请先提交或取消暂存这些文件。`)
  }
  if (!before.pagesExists) throw new Error(`找不到网页发布仓库：${pagesRepository}`)
  if (!before.pagesIsGitRepository) throw new Error(`网页发布目录不是有效的 Git 仓库：${pagesRepository}`)
  if (before.pagesBranch !== 'main') throw new Error(`网页发布仓库当前位于 ${before.pagesBranch || 'detached HEAD'}，必须切换到 main 分支。`)
  if (before.pagesStatusLines.length > 0) {
    throw new Error(`网页发布仓库含有未提交内容：${before.pagesStatusLines.join(', ')}。请先处理这些改动。`)
  }

  const message = commitMessage.trim() || `Update website copy (${new Date().toISOString().slice(0, 10)})`
  const logs: string[] = []
  const check = await runProjectCheck(root)
  logs.push(check.stdout.trim())

  await runGit(root, ['add', '--', ...before.sessionFiles])
  const stagedAfterAdd = await gitLines(root, ['diff', '--cached', '--name-only'])
  const unexpected = stagedAfterAdd.filter(file => !before.sessionFiles.includes(file.replaceAll('\\', '/')))
  if (unexpected.length > 0) throw new Error(`检测到意外暂存文件，已停止提交：${unexpected.join(', ')}`)
  if (stagedAfterAdd.length > 0) {
    const commit = await commitWithRepositoryIdentity(root, message)
    logs.push(commit.stdout.trim())
  } else {
    logs.push('源码文字已经提交，继续检查远端和网页发布状态。')
  }
  const pushed = await runGit(root, ['push', 'origin', before.branch])
  logs.push(pushed.stderr.trim() || pushed.stdout.trim())

  const dist = join(root, 'dist')
  await clearDirectoryExceptGit(pagesRepository)
  const nestedDistGit = resolve(dist, '.git')
  await cp(dist, pagesRepository, {
    recursive: true,
    filter: source => {
      const resolvedSource = resolve(source)
      return resolvedSource !== nestedDistGit && !resolvedSource.startsWith(`${nestedDistGit}${sep}`)
    }
  })
  await runGit(pagesRepository, ['add', '-A'])
  const pagesChanges = await gitLines(pagesRepository, ['status', '--porcelain'])
  if (pagesChanges.length > 0) {
    const pagesCommit = await commitWithRepositoryIdentity(pagesRepository, message)
    logs.push(pagesCommit.stdout.trim())
  } else {
    logs.push('网页构建产物没有变化，无需创建新的发布提交。')
  }
  const pagesPush = await runGit(pagesRepository, ['push', 'origin', 'main'])
  logs.push(pagesPush.stderr.trim() || pagesPush.stdout.trim())

  await writeSession(root, { files: [], savedAt: '' })
  return { message: '源码与个人网页均已同步。', logs: logs.filter(Boolean) }
}

export function textEditorPlugin(options: TextEditorPluginOptions = {}): Plugin {
  const accessToken = randomBytes(24).toString('hex')
  let root = process.cwd()
  let pagesRepository = ''

  return {
    name: 'local-visual-text-editor',
    apply: 'serve',
    configResolved(config) {
      root = config.root
      pagesRepository = resolve(root, options.pagesRepository ?? '../yuxuanz777.github.io')
    },
    resolveId(id) {
      if (id === VIRTUAL_TOKEN_ID) return RESOLVED_VIRTUAL_TOKEN_ID
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_TOKEN_ID) return `export default ${JSON.stringify(accessToken)}`
    },
    transformIndexHtml(html) {
      return {
        html,
        tags: [{
          tag: 'script',
          attrs: { type: 'module', src: '/scripts/text-editor/client.ts' },
          injectTo: 'body'
        }]
      }
    },
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const url = new URL(request.url ?? '/', 'http://localhost')
        if (!url.pathname.startsWith(API_PREFIX)) return next()
        if (request.headers['x-editor-token'] !== accessToken) {
          return json(response, 403, { error: '无效的本地编辑器令牌。' })
        }

        try {
          if (request.method === 'POST' && url.pathname === `${API_PREFIX}/locate`) {
            const body = await readJsonBody(request)
            const text = typeof body.text === 'string' ? body.text : ''
            const locale = body.locale === 'zh' ? 'zh' : 'en'
            return json(response, 200, { candidates: await locateCandidates(root, text, locale) })
          }
          if (request.method === 'POST' && url.pathname === `${API_PREFIX}/save`) {
            const body = await readJsonBody(request)
            const session = await saveEdits(root, body.edits as TextEdit[])
            return json(response, 200, { message: `已保存 ${session.files.length} 个源文件。`, session })
          }
          if (request.method === 'GET' && url.pathname === `${API_PREFIX}/status`) {
            return json(response, 200, await repositoryStatus(root, pagesRepository))
          }
          if (request.method === 'POST' && url.pathname === `${API_PREFIX}/publish`) {
            const body = await readJsonBody(request)
            const token = typeof body.token === 'string' ? body.token : ''
            const commitMessage = typeof body.commitMessage === 'string' ? body.commitMessage : ''
            return json(response, 200, await publish(root, pagesRepository, token, commitMessage))
          }
          return json(response, 404, { error: '未知的文本编辑器接口。' })
        } catch (error) {
          server.config.logger.error(`[text-editor] ${errorMessage(error)}`)
          return json(response, 400, { error: errorMessage(error) })
        }
      })
    }
  }
}
