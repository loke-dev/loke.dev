import assert from 'node:assert/strict'
import test from 'node:test'
import { highlightCode } from './shiki.server.ts'

test('shares highlighter startup across concurrent code blocks', async () => {
  const snippets = Array.from(
    { length: 16 },
    (_, index) => `export const value${index}: number = ${index}`
  )

  const html = await Promise.all(
    snippets.map((snippet) => highlightCode(snippet, 'typescript'))
  )

  assert.equal(html.length, snippets.length)
  assert.ok(html.every((snippet) => snippet.includes('shiki')))
})
