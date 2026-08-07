import assert from 'node:assert/strict'
import test from 'node:test'
import { escapeXml } from './xml.ts'

test('escapes values for XML text and attributes', () => {
  assert.equal(
    escapeXml('https://loke.dev/blog/a&b?quote="yes"'),
    'https://loke.dev/blog/a&amp;b?quote=&quot;yes&quot;'
  )
})

test('leaves safe XML values unchanged', () => {
  assert.equal(
    escapeXml('https://loke.dev/blog/hello-world'),
    'https://loke.dev/blog/hello-world'
  )
})
