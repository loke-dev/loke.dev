import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const layout = readFileSync(
  new URL('../layouts/BaseLayout.astro', import.meta.url),
  'utf8'
)
const headers = readFileSync(
  new URL('../../public/_headers', import.meta.url),
  'utf8'
)

test('keeps Muro Analytics in the shared document head', () => {
  assert.match(
    layout,
    /<script\s+async\s+data-project-id="f08c2acd-2566-41d9-9af5-c34505ca3a1c"\s+src="https:\/\/api\.muroanalytics\.com\/muro\.js"><\/script>/
  )
})

test('allows Muro Analytics through the static security policy', () => {
  assert.match(headers, /script-src[^\n]*https:\/\/api\.muroanalytics\.com/)
  assert.match(headers, /connect-src[^\n]*https:\/\/cdn\.muroanalytics\.com/)
})
