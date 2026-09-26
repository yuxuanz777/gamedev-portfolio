import { copyFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const distUrl = new URL('../dist/', import.meta.url)

await copyFile(
  fileURLToPath(new URL('index.html', distUrl)),
  fileURLToPath(new URL('404.html', distUrl))
)

console.log('Created dist/404.html for history-mode route fallback.')
