import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateReadingTime } from './reading-time.ts'

test('counts words without treating whitespace-only spans as words', () => {
  const result = calculateReadingTime([
    {
      _type: 'block',
      children: [{ text: ' Hello ' }, { text: '   ' }, { text: 'world' }],
    },
    { _type: 'callout', text: ' A useful note ' },
  ])

  assert.equal(result.wordCount, 5)
  assert.equal(result.readingTime, 1)
})
