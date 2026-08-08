import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const redirects = readFileSync(
  new URL('../../public/_redirects', import.meta.url),
  'utf8'
)

const staticRoutes = [
  ['/about/', '/about'],
  ['/affiliate-disclosure/', '/affiliate-disclosure'],
  ['/brand/', '/brand'],
  ['/changelog/', '/changelog'],
  ['/contact/', '/contact'],
  ['/now/', '/now'],
  ['/privacy/', '/privacy'],
  ['/projects/', '/projects'],
  ['/services/', '/services'],
  ['/tools/', '/tools'],
  ['/apps/flexithyme/privacy/', '/apps/flexithyme/privacy'],
  ['/apps/flexithyme/support/', '/apps/flexithyme/support'],
] as const

test('keeps static page URLs permanently slashless', () => {
  for (const [from, to] of staticRoutes) {
    assert.match(redirects, new RegExp(`^${from} ${to} 308$`, 'm'))
  }
})

test('keeps nested tool URLs permanently slashless', () => {
  assert.match(redirects, /^\/tools\/\*\/ \/tools\/:splat 308$/m)
})
