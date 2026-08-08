import assert from 'node:assert/strict'
import test from 'node:test'
import { safeExternalUrl } from './external-url.ts'

test('accepts absolute HTTP(S) URLs and trims whitespace', () => {
  assert.equal(
    safeExternalUrl(' https://github.com/loke-dev/loke.dev '),
    'https://github.com/loke-dev/loke.dev'
  )
  assert.equal(
    safeExternalUrl('http://example.com/path'),
    'http://example.com/path'
  )
})

test('rejects unsafe, relative, and malformed URLs', () => {
  assert.equal(safeExternalUrl('javascript:alert(1)'), null)
  assert.equal(safeExternalUrl('/projects'), null)
  assert.equal(safeExternalUrl('not a URL'), null)
  assert.equal(safeExternalUrl(''), null)
  assert.equal(safeExternalUrl(null), null)
})
