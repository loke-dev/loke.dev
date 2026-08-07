import assert from 'node:assert/strict'
import test from 'node:test'
import { getSanityImageDimensions } from './sanity-image.ts'

test('reads dimensions from a Sanity image asset reference', () => {
  assert.deepEqual(
    getSanityImageDimensions({
      _ref: 'image-abc123-1376x768-jpg',
    }),
    { width: 1376, height: 768 }
  )
})

test('ignores missing or malformed Sanity asset references', () => {
  assert.equal(getSanityImageDimensions(undefined), null)
  assert.equal(getSanityImageDimensions({ _ref: 'image-abc123-jpg' }), null)
})
