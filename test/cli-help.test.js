const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

test('prints usage with --help', () => {
  const out = execFileSync('node', [path.join(__dirname, '..', 'bin', 'boardy4age.js'), '--help']).toString();
  assert.match(out, /boardy4age \[focus note\.\.\.\]/);
});
