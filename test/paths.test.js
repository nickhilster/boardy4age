const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');

test('homeDir defaults to ~/.boardy4age', () => {
  delete process.env.BOARDY4AGE_HOME;
  delete require.cache[require.resolve('../src/paths')];
  const { homeDir } = require('../src/paths');
  assert.equal(homeDir(), path.join(os.homedir(), '.boardy4age'));
});

test('homeDir honors BOARDY4AGE_HOME override', () => {
  process.env.BOARDY4AGE_HOME = '/tmp/custom-boardy4age';
  delete require.cache[require.resolve('../src/paths')];
  const { homeDir } = require('../src/paths');
  assert.equal(homeDir(), '/tmp/custom-boardy4age');
  delete process.env.BOARDY4AGE_HOME;
});
