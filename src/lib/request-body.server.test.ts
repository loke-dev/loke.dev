import assert from 'node:assert/strict'
import test from 'node:test'
import { readRequestBody } from './request-body.server.ts'

test('reads bodies within the byte limit', async () => {
  const body = await readRequestBody(
    new Request('https://loke.dev', { method: 'POST', body: 'hello' }),
    5
  )

  assert.equal(body, 'hello')
})

test('rejects a body using Content-Length before reading it', async () => {
  const body = await readRequestBody(
    new Request('https://loke.dev', {
      method: 'POST',
      headers: { 'content-length': '20' },
      body: 'hello',
    }),
    5
  )

  assert.equal(body, null)
})

test('rejects chunked or inaccurate bodies after encoding', async () => {
  const body = await readRequestBody(
    new Request('https://loke.dev', { method: 'POST', body: 'ååå' }),
    5
  )

  assert.equal(body, null)
})
