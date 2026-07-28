import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const requireFromEslint = createRequire(require.resolve('eslint/package.json'))
const requireFromMinimatch = createRequire(
  requireFromEslint.resolve('minimatch/package.json'),
)
const expand = requireFromMinimatch('brace-expansion')

assert.deepEqual(expand('{a,b}'), ['a', 'b'])
assert.deepEqual(expand('{alpha,beta}', { maxLength: 4 }), ['beta'])

console.log('Verified patched brace-expansion compatibility and length cap.')
