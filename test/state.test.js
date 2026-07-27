const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

function withTempHome(fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'boardy4age-state-test-'));
  process.env.BOARDY4AGE_HOME = dir;
  delete require.cache[require.resolve('../src/paths')];
  delete require.cache[require.resolve('../src/state')];
  const result = fn(require('../src/state'));
  delete process.env.BOARDY4AGE_HOME;
  return result;
}

test('loadState returns null when no state file exists', () => {
  withTempHome(({ loadState }) => {
    assert.equal(loadState('abc123'), null);
  });
});

test('saveState then loadState round-trips', () => {
  withTempHome(({ saveState, loadState }) => {
    const state = { lastCommitSha: 'deadbeef', lastThreadId: 't1', lastSubject: '4Age - Update', lastRunAt: '2026-07-26T00:00:00Z' };
    saveState('abc123', state);
    assert.deepEqual(loadState('abc123'), state);
  });
});

test('loadState returns null for corrupted JSON rather than throwing', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'boardy4age-state-test-'));
  process.env.BOARDY4AGE_HOME = dir;
  delete require.cache[require.resolve('../src/paths')];
  delete require.cache[require.resolve('../src/state')];
  const { loadState, statePathFor } = require('../src/state');
  fs.mkdirSync(path.dirname(statePathFor('abc123')), { recursive: true });
  fs.writeFileSync(statePathFor('abc123'), '{not valid json');
  assert.equal(loadState('abc123'), null);
  delete process.env.BOARDY4AGE_HOME;
});
