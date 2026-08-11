import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const sourceRoot = join(root, 'src')
const publicRoot = join(root, 'public')
const readableExtensions = new Set(['.vue', '.ts', '.less', '.html'])
const referencedAssets = new Set()

function walk(directory) {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name)
    if (statSync(path).isDirectory()) walk(path)
    else if (readableExtensions.has(extname(path))) scan(path)
  }
}

function scan(path) {
  const source = readFileSync(path, 'utf8')
  const assetPattern = /["'`](\/(?:img|d)\/[^"'`?#)\s]+|\/favicon\.(?:ico|svg))/g
  for (const match of source.matchAll(assetPattern)) referencedAssets.add(match[1])
}

walk(sourceRoot)
scan(join(root, 'index.html'))

const missing = [...referencedAssets]
  .filter(asset => !existsSync(join(publicRoot, asset.slice(1))))
  .sort()

if (missing.length) {
  console.error(`Missing ${missing.length} public asset(s):`)
  missing.forEach(asset => console.error(`- ${asset}`))
  process.exitCode = 1
} else {
  console.log(`Verified ${referencedAssets.size} referenced public assets.`)
}
