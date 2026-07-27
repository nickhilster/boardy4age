const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

function withTempHome(fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'boardy4age-config-test-'));
  process.env.BOARDY4AGE_HOME = dir;
  delete require.cache[require.resolve('../src/paths')];
  delete require.cache[require.resolve('../src/config')];
  return fn(require('../src/config'));
}

test('loadConfig returns null when unset', () => {
  withTempHome(({ loadConfig }) => {
    assert.equal(loadConfig(), null);
  });
});

test('saveConfig then loadConfig round-trips', () => {
  withTempHome(({ saveConfig, loadConfig }) => {
    const config = {
      boardyEmail: 'boardy@boardy.ai',
      subjectPrefix: '4Age -',
      signature: 'Nikhil (via boardy4age CLI)',
      oauthClientId: 'client-id',
      oauthClientSecret: 'client-secret',
    };
    saveConfig(config);
    assert.deepEqual(loadConfig(), config);
  });
});

test('promptForConfig collects answers with defaults applied', async () => {
  await withTempHome(async ({ promptForConfig }) => {
    const answers = ['', '', 'Nikhil (via boardy4age CLI)', 'client-id', 'client-secret'];
    let i = 0;
    const io = { question: async () => answers[i++] };
    const config = await promptForConfig(io);
    assert.equal(config.boardyEmail, 'boardy@boardy.ai');
    assert.equal(config.subjectPrefix, '4Age -');
    assert.equal(config.signature, 'Nikhil (via boardy4age CLI)');
    assert.equal(config.oauthClientId, 'client-id');
    assert.equal(config.oauthClientSecret, 'client-secret');
  });
});
